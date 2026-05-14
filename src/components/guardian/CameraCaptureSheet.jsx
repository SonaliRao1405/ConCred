import { useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, VideoOff } from 'lucide-react'
import { captureEvidenceFrame, startCameraStream, stopCameraStream } from '../../services/cameraCapture'
import { GlassPanel } from '../shared/Primitives'

export function CameraCaptureSheet({
  captureLabel,
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
  const [isStarting, setIsStarting] = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setError('')
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
        const stream = await startCameraStream()
        if (cancelled) {
          stopCameraStream(stream)
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
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
    try {
      const nextPreview = captureEvidenceFrame(videoRef.current, {
        evidenceLabel: captureLabel,
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
                disabled={Boolean(error) || isStarting}
              >
                {isStarting ? <RefreshCw size={16} className="spin-lite" /> : <Camera size={16} />}
                {isStarting ? t('uploads.startingCamera') : t('common.actions.capturePhoto')}
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
