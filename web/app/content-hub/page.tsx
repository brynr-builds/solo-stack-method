/*
 * DEV NOTES:
 * - Why: Hello World Content Hub scaffold - the example app users build
 * - Phase 1: Static scaffold showing structure, no real content editing
 * - Phase 2+: Real content management with Supabase backend
 * 
 * REQUIREMENTS:
 * - Public read / private edit
 * - Basic content model only
 * - Treat content updates as governed changes
 * 
 * INTENTIONALLY NOT BUILT:
 * - Rich text editor
 * - Image uploads
 * - Categories/tags
 * - Comments
 * - Search
 * 
 * EVOLUTION:
 * - Phase 2: Real CRUD with Supabase
 * - Phase 3: Governed content updates via PR workflow
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

const samplePosts = [
  {
    id: 1,
    title: 'Welcome to Your Content Hub',
    excerpt: 'This is your first piece of content. Edit it to make it your own!',
    content: 'This is the full content of your first post. In Phase 2, you\'ll be able to edit this through a governed workflow.',
    author: 'You',
    date: '2024-01-31',
  },
  {
    id: 2,
    title: 'How Governed Changes Work',
    excerpt: 'Every edit goes through the Solo Stack governance process.',
    content: 'When you edit content, Claude proposes changes, ChatGPT audits them, and you approve before anything goes live.',
    author: 'Solo Stack',
    date: '2024-01-30',
  },
]

export default function ContentHubPage() {
  const [selectedPost, setSelectedPost] = useState<typeof samplePosts[0] | null>(null)
  const [isAuthenticated] = useState(true) // Simulated auth state

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-600 hover:text-solo-primary">
            ← Back to Dashboard
          </Link>
          <span className="font-bold text-solo-primary">Content Hub</span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
            Scaffold Only
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-solo-primary mb-2">Your Content Hub</h1>
          <p className="text-gray-600">
            Public users can read. Authenticated users can propose edits.
          </p>
        </div>

        {/* Scaffold Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-amber-800 mb-2">📋 Phase 1 Scaffold</h3>
          <p className="text-sm text-amber-700">
            This is a structural preview of the Hello World Content Hub. Real content management 
            with governed edits will be implemented in Phase 2.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Post List */}
          <div className="md:col-span-1">
            <h2 className="font-semibold mb-4">Posts</h2>
            <div className="space-y-3">
              {samplePosts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedPost?.id === post.id
                      ? 'border-solo-accent bg-solo-accent/5'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-sm mb-1">{post.title}</h3>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </button>
              ))}
            </div>

            {isAuthenticated && (
              <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-solo-accent hover:text-solo-accent transition-colors text-sm">
                + New Post (Phase 2)
              </button>
            )}
          </div>

          {/* Post View */}
          <div className="md:col-span-2">
            {selectedPost ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{selectedPost.date}</span>
                  {isAuthenticated && (
                    <button className="text-sm text-solo-accent hover:underline">
                      Edit (Phase 2)
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
                <p className="text-gray-600 leading-relaxed">{selectedPost.content}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-sm text-gray-500">By {selectedPost.author}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                <p>Select a post to view</p>
              </div>
            )}

            {/* Governance Info */}
            {isAuthenticated && selectedPost && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Governed Editing (Phase 2)</h4>
                <p className="text-xs text-gray-600">
                  When you edit this content, the change will go through the full governance 
                  workflow: Claude proposes → ChatGPT audits → You approve → Changes go live.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Model */}
        <div className="mt-12 bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Content Model (Phase 1)</h3>
          <div className="bg-white rounded-lg p-4 font-mono text-sm">
            <pre className="text-gray-700">{`{
  id: number,
  title: string,
  excerpt: string,
  content: string,
  author: string,
  date: string,
  // Phase 2+: status, categories, images
}`}</pre>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Intentionally not built:</strong> Rich text editor, image uploads, 
            categories/tags, comments, search. These evolve in later phases.
          </p>
        </div>
      </div>
    </div>
  )
}
