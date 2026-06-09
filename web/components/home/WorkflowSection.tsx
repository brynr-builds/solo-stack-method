export function WorkflowSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">The 7 Practical Steps</h2>
        <p className="text-center text-gray-600 mb-12">
          Every project follows the same governed workflow
        </p>
        <div className="grid md:grid-cols-7 gap-4">
          {[
            { step: 1, title: "Create Repo" },
            { step: 2, title: "Tech Stack" },
            { step: 3, title: "Context" },
            { step: 4, title: "Build" },
            { step: 5, title: "Test" },
            { step: 6, title: "Audit" },
            { step: 7, title: "Deploy" },
          ].map(({ step, title }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-solo-accent text-white flex items-center justify-center text-xl font-bold mb-2">
                {step}
              </div>
              <div className="text-sm font-medium">{title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
