import { pulseData } from '../data';

interface NewsletterSignupProps {
  email: string;
  setEmail: (email: string) => void;
  selectedTools: string[];
  handleToolToggle: (tool: string) => void;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export function NewsletterSignup({
  email,
  setEmail,
  selectedTools,
  handleToolToggle,
  submitted,
  handleSubmit
}: NewsletterSignupProps) {
  return (
    <section className="px-6 py-16 bg-solo-primary text-white">
      <div className="max-w-2xl mx-auto">
        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">Get Pulse Alerts</h2>
            <p className="text-center text-gray-300 mb-8">
              Select the tools you care about and get notified when they update.
            </p>

            {/* Tool Selection */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Select tools to watch:</p>
              <div className="flex flex-wrap gap-2">
                {pulseData.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleToolToggle(item.tool)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTools.includes(item.tool)
                        ? 'bg-white text-solo-primary'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {item.tool}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg text-solo-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="bg-white text-solo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Free newsletter. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">You&apos;re Subscribed!</h2>
            <p className="text-gray-300 mb-4">
              You&apos;ll receive updates for: {selectedTools.join(', ') || 'All tools'}
            </p>
            <p className="text-sm text-gray-400">
              Check your email for a personalized link to return with your preferences saved.
            </p>
            {/* TODO Phase 2: Generate and store personalized link */}
          </div>
        )}
      </div>
    </section>
  );
}
