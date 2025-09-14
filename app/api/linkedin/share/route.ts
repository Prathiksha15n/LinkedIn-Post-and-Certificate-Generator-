import { type NextRequest, NextResponse } from "next/server"

declare global {
  var certificateStore: Map<string, any> | undefined
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("linkedin_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "LinkedIn authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { postText, certificateId } = body

    if (!postText || !certificateId) {
      return NextResponse.json({ error: "Post text and certificate ID are required" }, { status: 400 })
    }

    if (!globalThis.certificateStore) {
      globalThis.certificateStore = new Map()
    }
    const certificateData = globalThis.certificateStore.get(certificateId)

    if (!certificateData) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Get certificate data
    const certificateStore = globalThis.certificateStore

    // Step 1: Get user profile to get person URN
    const profileResponse = await fetch("https://api.linkedin.com/v2/people/~", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!profileResponse.ok) {
      throw new Error("Failed to get user profile")
    }

    const profile = await profileResponse.json()
    const personUrn = profile.id

    // Step 2: Register upload for certificate document
    const registerUploadResponse = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-document"],
          owner: `urn:li:person:${personUrn}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    })

    if (!registerUploadResponse.ok) {
      throw new Error("Failed to register upload")
    }

    const uploadData = await registerUploadResponse.json()
    const uploadUrl =
      uploadData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl
    const asset = uploadData.value.asset

    // Step 3: Upload certificate document
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/pdf",
      },
      body: certificateData.buffer,
    })

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload certificate")
    }

    // Step 4: Create LinkedIn post with document
    const shareResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: `urn:li:person:${personUrn}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postText,
            },
            shareMediaCategory: "DOCUMENT",
            media: [
              {
                status: "READY",
                description: {
                  text: "Professional Development Certificate from Incanto Dynamics",
                },
                media: asset,
                title: {
                  text: `Certificate - ${certificateData.name}`,
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    })

    if (!shareResponse.ok) {
      const errorData = await shareResponse.text()
      console.error("LinkedIn share error:", errorData)
      throw new Error("Failed to create LinkedIn post")
    }

    const shareData = await shareResponse.json()
    const postId = shareData.id

    // Update certificate share status
    certificateData.shareStatus = "success"
    certificateData.linkedinPostId = postId
    certificateData.sharedAt = new Date().toISOString()
    certificateStore.set(certificateId, certificateData)

    return NextResponse.json({
      postId,
      message: "Successfully shared on LinkedIn",
    })
  } catch (error) {
    console.error("LinkedIn share error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to share on LinkedIn" },
      { status: 500 },
    )
  }
}
