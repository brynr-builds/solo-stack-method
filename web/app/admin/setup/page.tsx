'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAdminSetup } from './useAdminSetup'
import { BackupCodesView } from './BackupCodesView'
import { SetupFormView } from './SetupFormView'

function AdminSetupForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') ?? ''

  const {
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
  } = useAdminSetup(emailParam)

  if (backupCodes) {
    return (
      <BackupCodesView
        backupCodes={backupCodes}
        copied={copied}
        handleCopyCodes={handleCopyCodes}
        handleContinueToAdmin={handleContinueToAdmin}
      />
    )
  }

  return (
    <SetupFormView
      email={email}
      setupSecret={setupSecret}
      setSetupSecret={setSetupSecret}
      loading={loading}
      error={error}
      handleSubmit={handleSubmit}
    />
  )
}

export default function AdminSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <AdminSetupForm />
    </Suspense>
  )
}
