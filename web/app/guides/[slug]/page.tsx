/* DEV NOTES (2026-06-08): Renders a guide from web/content/guides/<slug>.md. */
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticle, getArticles } from '../../../lib/content'
import ArticleLayout, { articleMetadata } from '../../../components/ArticleLayout'

export function generateStaticParams() {
  return getArticles('guides').map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle('guides', params.slug)
  return a ? articleMetadata(a) : { title: 'Not found | Solo Stack Method' }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const a = getArticle('guides', params.slug)
  if (!a) notFound()
  return <ArticleLayout article={a} />
}
