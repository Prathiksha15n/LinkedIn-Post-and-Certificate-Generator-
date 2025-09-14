export interface LinkedInAuthResponse {
  authUrl: string
  state: string
}

export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
}

export interface LinkedInStatus {
  authenticated: boolean
  profile?: LinkedInProfile
}

export interface LinkedInShareResponse {
  postId: string
  message: string
}

export async function getLinkedInAuthUrl(): Promise<LinkedInAuthResponse> {
  const response = await fetch("/api/linkedin/auth?action=login")

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to get LinkedIn auth URL")
  }

  return response.json()
}

export async function getLinkedInStatus(): Promise<LinkedInStatus> {
  const response = await fetch("/api/linkedin/status")

  if (!response.ok) {
    return { authenticated: false }
  }

  return response.json()
}

export async function shareOnLinkedIn(postText: string, certificateId: string): Promise<LinkedInShareResponse> {
  const response = await fetch("/api/linkedin/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postText, certificateId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to share on LinkedIn")
  }

  return response.json()
}

export function openLinkedInAuth(authUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const popup = window.open(
      authUrl,
      "linkedin-auth",
      "width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no",
    )

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        // Check if authentication was successful
        setTimeout(async () => {
          const status = await getLinkedInStatus()
          resolve(status.authenticated)
        }, 1000)
      }
    }, 1000)

    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkClosed)
      if (popup && !popup.closed) {
        popup.close()
      }
      resolve(false)
    }, 300000)
  })
}
