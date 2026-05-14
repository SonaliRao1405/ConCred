export const RATE_CARD = {
  snare_removal: 5,
  patrol_log: 10,
  wildlife_sighting: 5,
  nest_check: 8,
  illegal_activity_report: 25,
  habitat_restoration: 15,
}

export const DAILY_LIMITS = {
  snare_removal: 10,
  patrol_log: 1,
  wildlife_sighting: 20,
  nest_check: 10,
  illegal_activity_report: 3,
  habitat_restoration: 6,
}

const EARTH_RADIUS_KM = 6371

export function calculateStreakMultiplier(streakDays) {
  if (streakDays >= 30) return 1.25
  if (streakDays >= 14) return 1.15
  if (streakDays >= 7) return 1.1
  if (streakDays >= 3) return 1.05
  return 1
}

export function calculateCredits(activityType, quantityValue, streakDays = 0) {
  const baseRate = RATE_CARD[activityType] ?? 0
  const quantity = Number(quantityValue) || 0
  const multiplier = calculateStreakMultiplier(streakDays)
  return Math.round(baseRate * quantity * multiplier)
}

export function haversineKm(pointA, pointB) {
  const toRadians = (value) => (value * Math.PI) / 180
  const deltaLat = toRadians(pointB.lat - pointA.lat)
  const deltaLng = toRadians(pointB.lng - pointA.lng)
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(pointA.lat)) *
      Math.cos(toRadians(pointB.lat)) *
      Math.sin(deltaLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export function pointInPolygon(point, polygon) {
  let inside = false

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const currentPoint = polygon[index]
    const previousPoint = polygon[previous]

    const intersects =
      currentPoint.lng > point.lng !== previousPoint.lng > point.lng &&
      point.lat <
        ((previousPoint.lat - currentPoint.lat) * (point.lng - currentPoint.lng)) /
          (previousPoint.lng - currentPoint.lng) +
          currentPoint.lat

    if (intersects) {
      inside = !inside
    }
  }

  return inside
}

export function getZoneForUser(user, organizations) {
  const organization = organizations.find((item) => item.id === user.organizationId)
  if (!organization) return null
  return (
    organization.patrolZones.find((zone) => zone.zoneId === user.patrolZoneId) ??
    organization.patrolZones[0] ??
    null
  )
}

export function getPolygonCenter(polygon) {
  const totals = polygon.reduce(
    (accumulator, point) => ({
      lat: accumulator.lat + point.lat,
      lng: accumulator.lng + point.lng,
    }),
    { lat: 0, lng: 0 },
  )

  return {
    lat: totals.lat / polygon.length,
    lng: totals.lng / polygon.length,
  }
}

export function getDemoCoordinates(zone, mode) {
  const center = getPolygonCenter(zone.polygon)

  if (mode === 'boundary') {
    const corner = zone.polygon[1]
    return {
      lat: (corner.lat + center.lat) / 2,
      lng: (corner.lng + center.lng) / 2,
    }
  }

  if (mode === 'outside') {
    return {
      lat: center.lat + 0.08,
      lng: center.lng - 0.09,
    }
  }

  return center
}

function distanceToPolygonVertices(point, polygon) {
  return Math.min(...polygon.map((vertex) => haversineKm(point, vertex)))
}

function listAlerts(detailAlerts, users, submissionUserId) {
  const alerts = [...detailAlerts]
  const user = users.find((item) => item.id === submissionUserId)

  if (user && user.fraudFlags.suspicionScore >= 60) {
    alerts.push('high_suspicion_score')
  }

  return [...new Set(alerts)]
}

export function evaluateSubmission(submission, context) {
  const { users, submissions, organizations } = context
  const user = users.find((item) => item.id === submission.userId)
  const organization = organizations.find((item) => item.id === submission.organizationId)
  const assignedZone = user ? getZoneForUser(user, organizations) : null
  const checks = []
  const detailAlerts = []
  let score = 100
  let suspicionDelta = 0
  let requiresManualReview = false

  const potentialCredits =
    submission.potentialCredits ??
    calculateCredits(submission.activityType, submission.quantityValue, user?.guardianProfile?.streakDays ?? 0)

  const submittedDate = new Date(submission.submittedAt)
  const exifDate = new Date(submission.exifTimestamp)
  const diffHours = Math.abs(submittedDate.getTime() - exifDate.getTime()) / (1000 * 60 * 60)

  if (diffHours <= 4) {
    checks.push({
      label: 'Timestamp consistency',
      passed: true,
      detail: `Capture submitted within ${diffHours.toFixed(1)} hours`,
    })
  } else if (diffHours <= 48) {
    score -= 12
    suspicionDelta += 8
    requiresManualReview = true
    detailAlerts.push('late_capture')
    checks.push({
      label: 'Timestamp consistency',
      passed: false,
      detail: `Capture delay of ${diffHours.toFixed(1)} hours needs review`,
    })
  } else {
    score -= 30
    suspicionDelta += 15
    requiresManualReview = true
    detailAlerts.push('stale_capture')
    checks.push({
      label: 'Timestamp consistency',
      passed: false,
      detail: `Capture delay of ${diffHours.toFixed(1)} hours is outside policy`,
    })
  }

  const duplicate = submissions.find(
    (item) => item.id !== submission.id && item.photoHash && item.photoHash === submission.photoHash,
  )

  if (duplicate) {
    score -= 20
    suspicionDelta += 20
    requiresManualReview = true
    detailAlerts.push('duplicate_photo')
    checks.push({
      label: 'Photo integrity',
      passed: false,
      detail: `Exact hash already linked to ${duplicate.id}`,
    })
  } else {
    checks.push({
      label: 'Photo integrity',
      passed: true,
      detail: 'No duplicate hash found',
    })
  }

  if (submission.photoEdited) {
    score -= 15
    suspicionDelta += 10
    requiresManualReview = true
    detailAlerts.push('edited_photo')
    checks.push({
      label: 'Photo metadata',
      passed: false,
      detail: 'Edited software marker present',
    })
  } else {
    checks.push({
      label: 'Photo metadata',
      passed: true,
      detail: 'No editing marker found',
    })
  }

  if (assignedZone) {
    const insideZone = pointInPolygon(submission.gpsCoordinates, assignedZone.polygon)
    const nearestVertexKm = distanceToPolygonVertices(submission.gpsCoordinates, assignedZone.polygon)

    if (insideZone) {
      checks.push({
        label: 'Zone match',
        passed: true,
        detail: `Inside ${assignedZone.name}`,
      })
    } else if (nearestVertexKm <= 2) {
      score -= 10
      requiresManualReview = true
      detailAlerts.push('near_zone_boundary')
      checks.push({
        label: 'Zone match',
        passed: false,
        detail: `Near assigned boundary (${nearestVertexKm.toFixed(1)} km)`,
      })
    } else {
      score -= 25
      suspicionDelta += 5
      requiresManualReview = true
      detailAlerts.push('outside_zone')
      checks.push({
        label: 'Zone match',
        passed: false,
        detail: `${nearestVertexKm.toFixed(1)} km from the assigned zone`,
      })
    }
  }

  if (submission.gpsAccuracy <= 500) {
    checks.push({
      label: 'GPS accuracy',
      passed: true,
      detail: `${submission.gpsAccuracy}m accuracy`,
    })
  } else if (submission.gpsAccuracy <= 2000) {
    score -= 10
    requiresManualReview = true
    detailAlerts.push('low_gps_confidence')
    checks.push({
      label: 'GPS accuracy',
      passed: false,
      detail: `${submission.gpsAccuracy}m accuracy is weak`,
    })
  } else {
    score -= 20
    suspicionDelta += 5
    requiresManualReview = true
    detailAlerts.push('very_low_gps_confidence')
    checks.push({
      label: 'GPS accuracy',
      passed: false,
      detail: `${submission.gpsAccuracy}m accuracy is unreliable`,
    })
  }

  const dayKey = submission.submittedAt.slice(0, 10)
  const sameDayCount = submissions.filter(
    (item) =>
      item.id !== submission.id &&
      item.userId === submission.userId &&
      item.activityType === submission.activityType &&
      item.submittedAt.slice(0, 10) === dayKey,
  ).length
  const dailyLimit = DAILY_LIMITS[submission.activityType] ?? 10

  if (sameDayCount + 1 > dailyLimit) {
    score -= 8
    suspicionDelta += 3
    requiresManualReview = true
    detailAlerts.push('rate_limit_exceeded')
    checks.push({
      label: 'Daily rate limit',
      passed: false,
      detail: `Submission ${sameDayCount + 1} exceeds the daily limit of ${dailyLimit}`,
    })
  } else {
    checks.push({
      label: 'Daily rate limit',
      passed: true,
      detail: `${sameDayCount + 1}/${dailyLimit} for today`,
    })
  }

  const previousSubmissions = submissions
    .filter((item) => item.userId === submission.userId && item.id !== submission.id && item.verificationStatus !== 'queued')
    .sort((left, right) => new Date(right.submittedAt) - new Date(left.submittedAt))

  const previousSubmission = previousSubmissions[0]

  if (previousSubmission) {
    const distanceKm = haversineKm(previousSubmission.gpsCoordinates, submission.gpsCoordinates)
    const timeHours =
      Math.abs(new Date(submission.submittedAt).getTime() - new Date(previousSubmission.submittedAt).getTime()) /
      (1000 * 60 * 60)
    const speedKph = timeHours > 0 ? distanceKm / timeHours : distanceKm

    if (speedKph > 80) {
      score -= 15
      suspicionDelta += 15
      requiresManualReview = true
      detailAlerts.push('impossible_speed')
      checks.push({
        label: 'Travel consistency',
        passed: false,
        detail: `Travel would require ${speedKph.toFixed(0)} km/h`,
      })
    } else {
      checks.push({
        label: 'Travel consistency',
        passed: true,
        detail: `${distanceKm.toFixed(1)} km since prior report`,
      })
    }
  }

  if (!organization) {
    score -= 15
    requiresManualReview = true
    detailAlerts.push('missing_org_context')
  }

  const boundedScore = Math.max(0, Math.round(score))
  const alerts = listAlerts(detailAlerts, users, submission.userId)
  let verificationStatus = 'approved'

  if (boundedScore < (organization?.fraudThresholds.autoRejectMaxScore ?? 40)) {
    verificationStatus = 'rejected'
  } else if (requiresManualReview || boundedScore < (organization?.fraudThresholds.autoApproveMinScore ?? 70)) {
    verificationStatus = 'flagged'
  }

  return {
    ...submission,
    verificationScore: boundedScore,
    verificationStatus,
    potentialCredits,
    creditsAwarded: verificationStatus === 'approved' ? potentialCredits : 0,
    verificationDetails: {
      checks,
      alerts,
      suggestedAction: verificationStatus === 'approved' ? 'auto_approve' : 'manual_review',
    },
    suspicionDelta,
  }
}

export function buildLeaderboard(submissions, users, organizationId) {
  return users
    .filter((user) => user.role === 'guardian' && user.organizationId === organizationId)
    .map((user) => {
      const approvedSubmissions = submissions.filter(
        (submission) =>
          submission.userId === user.id &&
          submission.organizationId === organizationId &&
          submission.verificationStatus === 'approved',
      )

      const credits = approvedSubmissions.reduce(
        (total, submission) => total + (submission.creditsAwarded || submission.potentialCredits || 0),
        0,
      )

      return {
        userId: user.id,
        displayName: user.displayName,
        verifiedActivities: approvedSubmissions.length,
        credits,
        verificationRate: user.creditProfile.verificationRate,
      }
    })
    .sort((left, right) => {
      if (right.credits !== left.credits) {
        return right.credits - left.credits
      }
      return right.verifiedActivities - left.verifiedActivities
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}

export function buildAlertFeed(submissions, users) {
  const alerts = []

  submissions.forEach((submission) => {
    const submissionUser = users.find((user) => user.id === submission.userId)
    const alertTags = submission.verificationDetails?.alerts ?? []

    if (alertTags.includes('duplicate_photo')) {
      alerts.push({
        id: `alert-duplicate-${submission.id}`,
        severity: 'critical',
        title: 'Duplicate photo hash detected',
        detail: `${submissionUser?.displayName ?? 'Guardian'} reused an existing image hash.`,
        submissionId: submission.id,
        userId: submission.userId,
      })
    }

    if (alertTags.includes('impossible_speed')) {
      alerts.push({
        id: `alert-speed-${submission.id}`,
        severity: 'high',
        title: 'Impossible travel pattern',
        detail: `${submissionUser?.displayName ?? 'Guardian'} reported movement too fast between two patrols.`,
        submissionId: submission.id,
        userId: submission.userId,
      })
    }

    if (alertTags.includes('outside_zone')) {
      alerts.push({
        id: `alert-zone-${submission.id}`,
        severity: 'medium',
        title: 'Report outside patrol zone',
        detail: `${submissionUser?.displayName ?? 'Guardian'} submitted far outside the assigned zone.`,
        submissionId: submission.id,
        userId: submission.userId,
      })
    }
  })

  users.forEach((user) => {
    if (user.role === 'guardian' && user.fraudFlags.suspicionScore >= 60) {
      alerts.push({
        id: `alert-user-${user.id}`,
        severity: 'critical',
        title: 'Guardian watchlist escalation',
        detail: `${user.displayName} crossed the suspicion score threshold.`,
        userId: user.id,
      })
    }
  })

  return alerts
}
