export function BackupCodesView({
  backupCodes,
  copied,
  handleCopyCodes,
  handleContinueToAdmin
}: {
  backupCodes: string[]
  copied: boolean
  handleCopyCodes: () => void
  handleContinueToAdmin: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Backup Codes</h1>
          <p className="text-sm text-gray-600 mb-4">
            Store these codes securely. They cannot be shown again. Each code can only be used once.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-1 mb-4">
            {backupCodes.map((code, i) => (
              <div key={i}>{code}</div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopyCodes}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleContinueToAdmin}
              className="flex-1 btn-primary"
            >
              Continue to Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
