import { describe, it, expect } from 'vitest'
import { getArticle, getArticles } from '../lib/content'

describe('Content Engine', () => {
  it('gets all articles', () => {
    const articles = getArticles('guides')
    expect(Array.isArray(articles)).toBe(true)
  })

  it('gets a single article', () => {
    // Write a dummy file to test
    const fs = require('fs')
    const path = require('path')
    const dir = path.join(process.cwd(), 'content', 'guides')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'test-article.md'), '---\ntitle: Test\n---\nHello')

    const article = getArticle('guides', 'test-article')
    expect(article).toBeDefined()
    expect(article?.title).toBe('Test')

    fs.unlinkSync(path.join(dir, 'test-article.md'))
  })
})
