import { useState, useEffect } from 'react'
import { startRegistration, WebAuthnAbortService, WebAuthnError } from '@simplewebauthn/browser'

const REGISTRATION_TIMEOUT_MS = 120_000

export function useAdminSetup(emailParam: string) {
  const [email, setEmail] = useState('')
  const [setupSecret, setSetupSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEmail(emailParam)
  }, [emailParam])

  useEffect(() => {
    return () => {
      WebAuthnAbortService.cancelCeremony()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !setupSecret) {
      setError('Email and setup secret are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const beginRes = await fetch('/api/admin/setup/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, setupSecret }),
      })
      if (!beginRes.ok) {
        const data = await beginRes.json().catch(() => ({}))
        throw new Error(data.error || 'Setup failed')
      }
      const options = await beginRes.json()

      const credential = await Promise.race([
        startRegistration({ optionsJSON: options }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Passkey prompt timed out. Look for a TouchID/FaceID or security key prompt—it may be behind the browser window. Try again.')),
            REGISTRATION_TIMEOUT_MS
          )
        ),
      ])

      const finishRes = await fetch('/api/admin/setup/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, setupSecret, response: credential }),
      })
      const finishData = await finishRes.json()

      if (!finishRes.ok) {
        throw new Error(finishData.error || 'Verification failed')
      }

      if (finishData.backupCodes?.length) {
        setBackupCodes(finishData.backupCodes)
      } else {
        window.location.href = finishData.redirectTo || '/admin'
      }
    } catch (err) {
      WebAuthnAbortService.cancelCeremony()
      if (err instanceof WebAuthnError) {
        if (err.code === 'ERROR_CEREMONY_ABORTED') {
          setError('Passkey registration was cancelled.')
        } else if (err.message?.includes('NotAllowedError') || err.name === 'NotAllowedError') {
          setError('Passkey prompt was dismissed or timed out. Try again and complete the TouchID/FaceID prompt.')
        } else {
          setError(err.message || 'Passkey registration failed')
        }
      } else {
        setError(err instanceof Error ? err.message : 'Setup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToAdmin = () => {
    window.location.href = '/admin'
  }

  const handleCopyCodes = async () => {
    if (!backupCodes) return
    await navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return {
    email,
    setupSecret,
    setSetupSecret,
    loading,
    error,
    backupCodes,
    copied,
    handleSubmit,
    handleContinueToAdmin,
    handleCopyCodes
  }
}
