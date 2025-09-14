import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  if (action === "login") {
    // Generate LinkedIn OAuth URL
    const clientId = process.env.LINKEDIN_CLIENT_ID
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/linkedin/callback`
    const state = Math.random().toString(36).substring(2, 15)
    const scope = "w_member_social r_liteprofile"

    if (!clientId) {
      return NextResponse.json({ error: "LinkedIn client ID not configured" }, { status: 500 })
    }

    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization")
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("state", state)
    authUrl.searchParams.set("scope", scope)

    // Store state for validation (in production, use secure session storage)
    const response = NextResponse.json({ authUrl: authUrl.toString(), state })
    response.cookies.set("linkedin_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    })

    return response
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
