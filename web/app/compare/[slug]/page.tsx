/* DEV NOTES (2026-06-08): Renders a comparison from web/content/compare/<slug>.md. */
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticle, getArticles } from '../../../lib/content'
import ArticleLayout, { articleMetadata } from '../../../components/ArticleLayout'

export function generateStaticParams() {
  return getArticles('compare').map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle('compare', params.slug)
  return a ? articleMetadata(a) : { title: 'Not found | Solo Stack Method' }
}

export default async function ComparePage({ params }: { params: { slug: string } }) {
  const a = getArticle('compare', params.slug)
  if (!a) notFound()
  // live facts: pulse-listed tools render the LiveFacts panel and {{pulse:*}}
  // tokens in prose resolve to current versions (hourly revalidate)
  const { getLiveFacts, injectLiveTokens } = await import('../../../lib/pulse/live')
  const live = a.pulse.length ? await getLiveFacts(a.pulse) : []
  const article = live.length ? { ...a, html: injectLiveTokens(a.html, live) } : a
  return <ArticleLayout article={article} live={live} />
}
