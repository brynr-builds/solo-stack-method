export function TargetAudienceSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Who This Is For</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold text-solo-success mb-4">✓ This is for you if...</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• You have a product idea but not engineering skills</li>
              <li>• You want real software, not just a demo</li>
              <li>• You understand AI is powerful but chaotic</li>
              <li>• You&apos;re willing to follow a process</li>
              <li>• You want to actually ship something</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold text-red-500 mb-4">✗ This is NOT for you if...</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• You want to &quot;vibe code&quot; with no structure</li>
              <li>• You expect AI to read your mind</li>
              <li>• You&apos;re looking for a no-code builder</li>
              <li>• You refuse to learn anything new</li>
              <li>• You want magic, not method</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
