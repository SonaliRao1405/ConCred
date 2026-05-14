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

export function captureEvidenceFrame(videoElement, { evidenceLabel, locale = 'en-IN' } = {}) {
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

  const stampHeight = Math.max(92, Math.round(height * 0.12))
  const stampTop = height - stampHeight
  const timeStamp = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(capturedAt)

  context.fillStyle = 'rgba(7, 13, 8, 0.74)'
  context.fillRect(0, stampTop, width, stampHeight)
  context.fillStyle = 'rgba(240, 253, 244, 0.94)'
  context.font = `700 ${Math.max(22, Math.round(width * 0.024))}px "DM Sans", sans-serif`
  context.fillText(evidenceLabel, 28, stampTop + Math.round(stampHeight * 0.42))
  context.fillStyle = 'rgba(110, 231, 183, 0.95)'
  context.font = `600 ${Math.max(18, Math.round(width * 0.019))}px "JetBrains Mono", monospace`
  context.fillText(timeStamp, 28, stampTop + Math.round(stampHeight * 0.74))

  const slug = toEvidenceSlug(evidenceLabel)

  return {
    capturedAt: capturedAt.toISOString(),
    dataUrl: canvas.toDataURL('image/jpeg', 0.9),
    height,
    mimeType: 'image/jpeg',
    name: `${slug || 'evidence'}-${capturedAt.toISOString().replaceAll(':', '-')}.jpg`,
    source: 'in-app-camera',
    width,
  }
}
