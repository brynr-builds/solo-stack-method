import { describe, it, expect } from 'vitest'
import { sanitizeRepoName } from '@/lib/build/github'

describe('sanitizeRepoName', () => {
  it('keeps valid lowercase, url-safe names unchanged', () => {
    expect(sanitizeRepoName('my-valid-repo')).toBe('my-valid-repo')
    expect(sanitizeRepoName('test.repo_123')).toBe('test.repo_123')
  })

  it('converts uppercase letters to lowercase', () => {
    expect(sanitizeRepoName('My-Valid-Repo')).toBe('my-valid-repo')
    expect(sanitizeRepoName('SOME_REPO_NAME')).toBe('some_repo_name')
  })

  it('trims leading and trailing spaces', () => {
    expect(sanitizeRepoName('  my-repo  ')).toBe('my-repo')
  })

  it('replaces invalid characters with hyphens', () => {
    expect(sanitizeRepoName('my repo name')).toBe('my-repo-name')
    expect(sanitizeRepoName('repo@with#special$chars')).toBe('repo-with-special-chars')
  })

  it('removes leading and trailing hyphens after replacement', () => {
    expect(sanitizeRepoName('!my-repo!')).toBe('my-repo')
    expect(sanitizeRepoName('---my-repo---')).toBe('my-repo')
    expect(sanitizeRepoName('  -my-repo-  ')).toBe('my-repo')
  })

  it('truncates the name to 90 characters', () => {
    const longName = 'a'.repeat(100)
    expect(sanitizeRepoName(longName)).toBe('a'.repeat(90))
    expect(sanitizeRepoName(longName).length).toBe(90)
  })

  it('returns default name for empty or completely invalid strings', () => {
    expect(sanitizeRepoName('')).toBe('my-solo-stack-site')
    expect(sanitizeRepoName('   ')).toBe('my-solo-stack-site')
    expect(sanitizeRepoName('!!!@@@###')).toBe('my-solo-stack-site')
  })
})
