import { useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, VideoOff } from 'lucide-react'
import { captureEvidenceFrame, startCameraStream, stopCameraStream } from '../../services/cameraCapture'
import { GlassPanel } from '../shared/Primitives'

export function CameraCaptureSheet({
  captureLabel,
  gps,
  isOpen,
  language,
  onCapture,
  onClose,
  t,
  title,
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState('')
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setError('')
      setIsCameraReady(false)
      setPreview(null)
      setIsStarting(false)
      stopCameraStream(streamRef.current)
      streamRef.current = null
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      return
    }

    let cancelled = false

    async function bootCamera() {
      try {
        setIsStarting(true)
        setError('')
        setIsCameraReady(false)
        const stream = await startCameraStream()
        if (cancelled) {
          stopCameraStream(stream)
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          await new Promise((resolve, reject) => {
            const videoElement = videoRef.current

            if (!videoElement) {
              reject(new Error('missing-video'))
              return
            }

            if (videoElement.readyState >= 2 && videoElement.videoWidth > 0) {
              resolve()
              return
            }

            const timeoutId = window.setTimeout(() => {
              cleanup()
              reject(new Error('camera-timeout'))
            }, 5000)

            const cleanup = () => {
              window.clearTimeout(timeoutId)
              videoElement.removeEventListener('loadeddata', handleReady)
              videoElement.removeEventListener('canplay', handleReady)
              videoElement.removeEventListener('playing', handleReady)
              videoElement.removeEventListener('error', handleFailure)
            }

            const handleReady = () => {
              cleanup()
              resolve()
            }

            const handleFailure = () => {
              cleanup()
              reject(new Error('camera-stream-failed'))
            }

            videoElement.addEventListener('loadeddata', handleReady)
            videoElement.addEventListener('canplay', handleReady)
            videoElement.addEventListener('playing', handleReady)
            videoElement.addEventListener('error', handleFailure)
          })

          if (videoRef.current?.requestVideoFrameCallback) {
            await new Promise((resolve) => {
              videoRef.current.requestVideoFrameCallback(() => resolve())
            })
          }
        }
        setIsCameraReady(true)
      } catch {
        setError(t('uploads.cameraAccessError'))
      } finally {
        if (!cancelled) {
          setIsStarting(false)
        }
      }
    }

    void bootCamera()

    return () => {
      cancelled = true
      stopCameraStream(streamRef.current)
      streamRef.current = null
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [isOpen, t])

  if (!isOpen) {
    return null
  }

  const handleCapture = () => {
    if (!isCameraReady) {
      setError(t('uploads.cameraReadyError'))
      return
    }

    try {
      const nextPreview = captureEvidenceFrame(videoRef.current, {
        evidenceLabel: captureLabel,
        gps,
        locale: language,
      })
      setPreview(nextPreview)
      setError('')
    } catch {
      setError(t('uploads.cameraReadyError'))
    }
  }

  const handleUseCapture = () => {
    if (!preview) {
      return
    }

    onCapture(preview)
    onClose()
  }

  return (
    <div className="camera-sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="camera-sheet__backdrop" onClick={onClose} />
      <GlassPanel
        title={title}
        subtitle={t('uploads.cameraSheetSubtitle')}
        action={
          <button type="button" className="ghost-button" onClick={onClose}>
            {t('common.actions.close')}
          </button>
        }
      >
        <div className="camera-sheet__body">
          <div className="camera-sheet__frame">
            {preview ? (
              <img src={preview.dataUrl} alt={captureLabel} className="camera-sheet__preview" />
            ) : (
              <video ref={videoRef} className="camera-sheet__video" autoPlay muted playsInline />
            )}
            <div className="camera-sheet__overlay">
              <span>{captureLabel}</span>
              <strong>{preview ? t('uploads.capturePreviewReady') : t('uploads.liveCamera')}</strong>
            </div>
          </div>

          {error ? (
            <div className="inline-alert">{error}</div>
          ) : null}

          <div className="camera-sheet__meta">
            <span>{t('uploads.cameraOnlyHint')}</span>
            <strong>
              {preview
                ? t('common.labels.capturedAt', {
                    value: new Date(preview.capturedAt).toLocaleString(language),
                  }, `Captured ${new Date(preview.capturedAt).toLocaleString(language)}`)
                : t('uploads.captureTimestampPending')}
            </strong>
            {preview?.imageId ? (
              <small>{`${t('common.fields.imageId', {}, 'Image ID')}: ${preview.imageId}`}</small>
            ) : null}
            {typeof preview?.gpsSnapshot?.lat === 'number' && typeof preview?.gpsSnapshot?.lng === 'number' ? (
              <small>
                {t('common.labels.gpsAccuracy', {
                  accuracy: preview.gpsSnapshot.accuracy ?? t('common.labels.notAvailable', {}, 'NA'),
                  lat: preview.gpsSnapshot.lat.toFixed(4),
                  lng: preview.gpsSnapshot.lng.toFixed(4),
                }, `Accuracy ${preview.gpsSnapshot.accuracy ?? 'NA'}m · ${preview.gpsSnapshot.lat.toFixed(4)}, ${preview.gpsSnapshot.lng.toFixed(4)}`)}
              </small>
            ) : null}
          </div>

          <div className="inline-actions">
            {preview ? (
              <>
                <button type="button" className="secondary-button" onClick={() => setPreview(null)}>
                  <RefreshCw size={16} />
                  {t('common.actions.retake')}
                </button>
                <button type="button" className="primary-button" onClick={handleUseCapture}>
                  <Camera size={16} />
                  {t('common.actions.useCapture')}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={handleCapture}
                disabled={Boolean(error) || isStarting || !isCameraReady}
              >
                {isStarting ? <RefreshCw size={16} className="spin-lite" /> : <Camera size={16} />}
                {isStarting
                  ? t('uploads.startingCamera')
                  : !isCameraReady
                    ? t('uploads.cameraPreparing')
                    : t('common.actions.capturePhoto')}
              </button>
            )}
            <button type="button" className="ghost-button" onClick={onClose}>
              <VideoOff size={16} />
              {t('common.actions.close')}
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
