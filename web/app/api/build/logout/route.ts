/* DEV NOTES (2026-06-09): Disconnect GitHub — clears the sealed token cookie. */
import { NextResponse } from 'next/server'
import { GH_COOKIE } from '../../../../lib/build/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(GH_COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
