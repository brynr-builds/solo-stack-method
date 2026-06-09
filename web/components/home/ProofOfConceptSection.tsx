import Link from 'next/link'

export function ProofOfConceptSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-solo-accent/10 text-solo-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
          Proof of Concept
        </div>
        <h2 className="text-3xl font-bold mb-4">This Product Is Built Using the Same Process It Teaches</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Every feature of Solo Stack Method was built using the governed workflow you&apos;ll learn.
          Claude builds, ChatGPT audits, and every change goes through a pull request.
        </p>
        <Link href="https://github.com/brynr-builds/solo-stack-method" target="_blank" className="btn-secondary">
          View Public Repository →
        </Link>
      </div>
    </section>
  )
}
