import { areFingerprintsSimilar } from './imageFingerprint.js'

const EARTH_RADIUS_METERS = 6371e3
const MIN_CLAIM_RADIUS_METERS = 35
const MAX_CLAIM_RADIUS_METERS = 80

function toRadians(value) {
  return (value * Math.PI) / 180
}

export function haversineMeters(pointA, pointB) {
  if (!pointA || !pointB) {
    return Number.POSITIVE_INFINITY
  }

  const deltaLat = toRadians(pointB.lat - pointA.lat)
  const deltaLng = toRadians(pointB.lng - pointA.lng)
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(pointA.lat)) *
      Math.cos(toRadians(pointB.lat)) *
      Math.sin(deltaLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_METERS * c
}

function getClaimRadiusMeters(currentGps, existingGps) {
  const currentAccuracy = Number(currentGps?.accuracy) || MIN_CLAIM_RADIUS_METERS
  const existingAccuracy = Number(existingGps?.accuracy) || MIN_CLAIM_RADIUS_METERS
  const blendedAccuracy = Math.round((currentAccuracy + existingAccuracy) / 2)
  return Math.max(MIN_CLAIM_RADIUS_METERS, Math.min(MAX_CLAIM_RADIUS_METERS, blendedAccuracy))
}

function getClaimTimestamp(activity) {
  return (
    activity?.verification?.claimTimestamp ||
    activity?.beforeEvidence?.capturedAt ||
    activity?.createdAt ||
    null
  )
}

function collectEvidence(activity) {
  return [
    activity?.beforeEvidence
      ? {
          ...activity.beforeEvidence,
          activityId: activity.id,
          slot: 'before',
          userId: activity.userId,
        }
      : null,
    activity?.afterEvidence
      ? {
          ...activity.afterEvidence,
          activityId: activity.id,
          slot: 'after',
          userId: activity.userId,
        }
      : null,
  ].filter(Boolean)
}

export function buildGuardianPublicId(role, userId) {
  const suffix = `${userId ?? ''}`
    .replace(/[^a-z0-9]/gi, '')
    .slice(-8)
    .toUpperCase()

  const prefix = role === 'ngo_admin' ? 'CC-NGO' : 'CC-GDN'
  return `${prefix}-${suffix || 'LOCAL'}`
}

export function evaluateActivityIntegrity(state, candidateActivity) {
  const candidateEvidence = [candidateActivity.beforeEvidence, candidateActivity.afterEvidence].filter(Boolean)

  if (candidateEvidence.length < 2) {
    return {
      accepted: false,
      code: 'capture_pair_required',
      message: 'Both before and after evidence must be present.',
    }
  }

  const samePairByHash =
    candidateActivity.beforeEvidence?.imageHash &&
    candidateActivity.beforeEvidence.imageHash === candidateActivity.afterEvidence?.imageHash
  const samePairByFingerprint = areFingerprintsSimilar(
    candidateActivity.beforeEvidence?.imageFingerprint,
    candidateActivity.afterEvidence?.imageFingerprint,
  )

  if (samePairByHash || samePairByFingerprint) {
    return {
      accepted: false,
      code: 'same_image_pair',
      message: 'Before and after images must be different captures.',
    }
  }

  const priorEvidence = state.activities
    .filter((activity) => activity.id !== candidateActivity.id && activity.status !== 'rejected')
    .flatMap(collectEvidence)

  const duplicateMatch = priorEvidence.find((existingEvidence) =>
    candidateEvidence.some(
      (candidateEvidenceItem) =>
        (candidateEvidenceItem.imageHash &&
          existingEvidence.imageHash &&
          candidateEvidenceItem.imageHash === existingEvidence.imageHash) ||
        areFingerprintsSimilar(candidateEvidenceItem.imageFingerprint, existingEvidence.imageFingerprint),
    ),
  )

  if (duplicateMatch) {
    return {
      accepted: false,
      code: 'duplicate_image',
      duplicateMatch,
      message: `This image has already been used in another activity and cannot be uploaded again.`,
    }
  }

  const candidateClaimTimestamp = getClaimTimestamp(candidateActivity)
  const candidateClaimTime = candidateClaimTimestamp ? new Date(candidateClaimTimestamp).getTime() : Number.NaN

  const overlappingActivities = state.activities
    .filter((activity) => activity.id !== candidateActivity.id && activity.status !== 'rejected')
    .filter((activity) => activity.activityType === candidateActivity.activityType)
    .map((activity) => {
      const distanceMeters = haversineMeters(candidateActivity.gps, activity.gps)
      const claimRadiusMeters = getClaimRadiusMeters(candidateActivity.gps, activity.gps)
      return {
        activity,
        claimRadiusMeters,
        distanceMeters,
        claimTimestamp: getClaimTimestamp(activity),
      }
    })
    .filter((entry) => entry.distanceMeters <= entry.claimRadiusMeters)
    .sort((left, right) => {
      const leftTime = new Date(left.claimTimestamp || left.activity.createdAt).getTime()
      const rightTime = new Date(right.claimTimestamp || right.activity.createdAt).getTime()
      return leftTime - rightTime
    })

  const earlierClaim = overlappingActivities.find((entry) => {
    const existingTime = new Date(entry.claimTimestamp || entry.activity.createdAt).getTime()

    if (Number.isNaN(candidateClaimTime)) {
      return true
    }

    return existingTime <= candidateClaimTime
  })

  if (earlierClaim) {
    return {
      accepted: false,
      code: 'duplicate_location_claim',
      conflict: earlierClaim,
      message: 'This work location has already been claimed by an earlier capture and cannot be uploaded again.',
    }
  }

  return {
    accepted: true,
    code: 'accepted',
    conflict: null,
    duplicateMatch: null,
    message: '',
  }
}
