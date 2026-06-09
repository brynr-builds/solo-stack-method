import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-solo-primary leading-tight mb-6">
          Build real software with AI — without losing control, from idea to deployment.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A governed workflow for non-technical builders who want to ship real projects using AI as their execution engine.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="btn-primary text-lg px-8 py-4">
            Start Your First Project — $20/month
          </Link>
        </div>
      </div>
    </section>
  )
}
