import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("linkedin_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ authenticated: false })
    }

    // Verify token is still valid by making a simple API call
    const profileResponse = await fetch("https://api.linkedin.com/v2/people/~", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (profileResponse.ok) {
      const profile = await profileResponse.json()
      return NextResponse.json({
        authenticated: true,
        profile: {
          id: profile.id,
          firstName: profile.localizedFirstName,
          lastName: profile.localizedLastName,
        },
      })
    } else {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}
