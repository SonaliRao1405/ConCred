const FINGERPRINT_WIDTH = 9
const FINGERPRINT_HEIGHT = 8
const DEFAULT_SIMILARITY_THRESHOLD = 4

function createScratchCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function getLuma(data, offset) {
  return Math.round(data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114)
}

export function createEvidenceImageId() {
  const token = globalThis.crypto?.randomUUID?.().replaceAll('-', '').slice(0, 12).toUpperCase()
  if (token) {
    return `CC-IMG-${token}`
  }

  return `CC-IMG-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function computeCanvasFingerprint(canvas, { sourceHeight = canvas?.height, sourceY = 0 } = {}) {
  if (!canvas?.width || !canvas?.height) {
    return ''
  }

  const sanitizedHeight = Math.max(1, Math.min(sourceHeight || canvas.height, canvas.height))
  const sanitizedY = Math.max(0, Math.min(sourceY || 0, canvas.height - sanitizedHeight))
  const scratchCanvas = createScratchCanvas(FINGERPRINT_WIDTH, FINGERPRINT_HEIGHT)
  const scratchContext = scratchCanvas.getContext('2d', { willReadFrequently: true })

  if (!scratchContext) {
    return ''
  }

  scratchContext.drawImage(
    canvas,
    0,
    sanitizedY,
    canvas.width,
    sanitizedHeight,
    0,
    0,
    FINGERPRINT_WIDTH,
    FINGERPRINT_HEIGHT,
  )

  const { data } = scratchContext.getImageData(0, 0, FINGERPRINT_WIDTH, FINGERPRINT_HEIGHT)
  let bits = ''

  for (let row = 0; row < FINGERPRINT_HEIGHT; row += 1) {
    for (let column = 0; column < FINGERPRINT_WIDTH - 1; column += 1) {
      const leftOffset = (row * FINGERPRINT_WIDTH + column) * 4
      const rightOffset = (row * FINGERPRINT_WIDTH + column + 1) * 4
      bits += getLuma(data, leftOffset) > getLuma(data, rightOffset) ? '1' : '0'
    }
  }

  return bits
}

export async function computeDataUrlFingerprint(dataUrl) {
  if (!dataUrl) {
    return ''
  }

  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      const canvas = createScratchCanvas(image.naturalWidth || image.width, image.naturalHeight || image.height)
      const context = canvas.getContext('2d')

      if (!context) {
        resolve('')
        return
      }

      context.drawImage(image, 0, 0)
      resolve(computeCanvasFingerprint(canvas))
    }
    image.onerror = () => resolve('')
    image.src = dataUrl
  })
}

export function countFingerprintDistance(leftFingerprint, rightFingerprint) {
  if (!leftFingerprint || !rightFingerprint || leftFingerprint.length !== rightFingerprint.length) {
    return Number.POSITIVE_INFINITY
  }

  let distance = 0

  for (let index = 0; index < leftFingerprint.length; index += 1) {
    if (leftFingerprint[index] !== rightFingerprint[index]) {
      distance += 1
    }
  }

  return distance
}

export function areFingerprintsSimilar(
  leftFingerprint,
  rightFingerprint,
  threshold = DEFAULT_SIMILARITY_THRESHOLD,
) {
  return countFingerprintDistance(leftFingerprint, rightFingerprint) <= threshold
}
