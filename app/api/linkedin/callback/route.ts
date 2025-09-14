import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=linkedin_auth_denied`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=linkedin_auth_invalid`)
    }

    // Validate state
    const storedState = request.cookies.get("linkedin_oauth_state")?.value
    if (state !== storedState) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=linkedin_auth_state_mismatch`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/linkedin/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Store access token securely (in production, use encrypted session storage)
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?linkedin_auth=success`)
    response.cookies.set("linkedin_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 3600, // Use token expiry or default to 1 hour
    })

    // Clear state cookie
    response.cookies.delete("linkedin_oauth_state")

    return response
  } catch (error) {
    console.error("LinkedIn OAuth callback error:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=linkedin_auth_failed`)
  }
}
