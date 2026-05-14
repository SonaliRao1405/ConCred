import { computeCanvasFingerprint, createEvidenceImageId } from '../lib/imageFingerprint.js'

function toEvidenceSlug(value) {
  return `${value ?? 'evidence'}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function startCameraStream() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Camera capture is not supported on this device.')
  }

  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1600 },
      height: { ideal: 1200 },
    },
  })
}

export function stopCameraStream(stream) {
  stream?.getTracks?.().forEach((track) => track.stop())
}

export function captureEvidenceFrame(videoElement, { evidenceLabel, gps = null, locale = 'en-IN' } = {}) {
  const width =
    videoElement?.videoWidth ||
    Math.round((videoElement?.clientWidth || 0) * (window.devicePixelRatio || 1)) ||
    0
  const height =
    videoElement?.videoHeight ||
    Math.round((videoElement?.clientHeight || 0) * (window.devicePixelRatio || 1)) ||
    0

  if (!width || !height) {
    throw new Error('Camera preview is not ready yet.')
  }

  const capturedAt = new Date()
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  context.drawImage(videoElement, 0, 0, width, height)

  const imageId = createEvidenceImageId()
  const imageFingerprint = computeCanvasFingerprint(canvas)
  const stampLines = [
    { value: evidenceLabel, tone: 'primary', weight: 700, size: Math.max(22, Math.round(width * 0.024)) },
    {
      value: new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(capturedAt),
      tone: 'secondary',
      weight: 600,
      size: Math.max(18, Math.round(width * 0.019)),
    },
    { value: `ID ${imageId}`, tone: 'secondary', weight: 600, size: Math.max(18, Math.round(width * 0.018)) },
  ]

  if (typeof gps?.lat === 'number' && typeof gps?.lng === 'number') {
    stampLines.push({
      value: `GPS ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)} · ±${Math.round(gps.accuracy ?? 0)}m`,
      tone: 'secondary',
      weight: 600,
      size: Math.max(16, Math.round(width * 0.016)),
    })
  }

  const stampHeight = Math.max(126, Math.round(height * (stampLines.length >= 4 ? 0.19 : 0.15)))
  const stampTop = height - stampHeight

  context.fillStyle = 'rgba(7, 13, 8, 0.74)'
  context.fillRect(0, stampTop, width, stampHeight)

  const lineStep = stampHeight / (stampLines.length + 0.65)
  stampLines.forEach((line, index) => {
    context.fillStyle = line.tone === 'primary' ? 'rgba(240, 253, 244, 0.94)' : 'rgba(110, 231, 183, 0.95)'
    context.font = `${line.weight} ${line.size}px ${line.tone === 'primary' ? '"DM Sans", sans-serif' : '"JetBrains Mono", monospace'}`
    context.fillText(line.value, 28, stampTop + Math.round(lineStep * (index + 1)))
  })

  const slug = toEvidenceSlug(evidenceLabel)

  return {
    capturedAt: capturedAt.toISOString(),
    dataUrl: canvas.toDataURL('image/jpeg', 0.9),
    gpsSnapshot: typeof gps?.lat === 'number' && typeof gps?.lng === 'number'
      ? {
          accuracy: gps.accuracy ?? null,
          lat: gps.lat ?? null,
          lng: gps.lng ?? null,
          lockedAt: gps.lockedAt ?? null,
        }
      : null,
    height,
    imageFingerprint,
    imageId,
    mimeType: 'image/jpeg',
    name: `${slug || 'evidence'}-${capturedAt.toISOString().replaceAll(':', '-')}.jpg`,
    source: 'in-app-camera',
    width,
  }
}
