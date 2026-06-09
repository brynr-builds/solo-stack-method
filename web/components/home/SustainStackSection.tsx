export function SustainStackSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
            OPTIONAL
          </span>
          <h2 className="text-3xl font-bold">Sustain the Stack</h2>
        </div>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          After you&apos;ve shipped successfully, you can optionally contribute to keep this project sustainable.
        </p>

        <div className="card max-w-lg mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">What This Is</h3>
          <ul className="text-left space-y-3 text-gray-600 mb-6">
            <li className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <span>A voluntary contribution after success</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <span>Helps maintain Stack Pulse and governance tools</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <span>Shows up only after you&apos;ve deployed</span>
            </li>
          </ul>

          <h3 className="text-xl font-bold mb-4">What This Is NOT</h3>
          <ul className="text-left space-y-3 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-red-400">✗</span>
              <span>Never required for execution</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-400">✗</span>
              <span>Never unlocks features</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-400">✗</span>
              <span>Never affects audit scores</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-400">✗</span>
              <span>Never pressured or prompted repeatedly</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
