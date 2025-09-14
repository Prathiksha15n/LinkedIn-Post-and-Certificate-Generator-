import { type NextRequest, NextResponse } from "next/server"

declare global {
  var certificateStore: Map<string, any> | undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { certificateId, shareStatus } = body

    if (!certificateId || !shareStatus) {
      return NextResponse.json({ error: "Certificate ID and share status are required" }, { status: 400 })
    }

    if (!globalThis.certificateStore) {
      globalThis.certificateStore = new Map()
    }
    const certificateData = globalThis.certificateStore.get(certificateId)

    if (!certificateData) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Update share status
    certificateData.shareStatus = shareStatus
    certificateData.sharedAt = new Date().toISOString()
    globalThis.certificateStore.set(certificateId, certificateData)

    return NextResponse.json({
      message: "Share status updated successfully",
      certificateId,
      shareStatus,
    })
  } catch (error) {
    console.error("Share status update error:", error)
    return NextResponse.json({ error: "Failed to update share status" }, { status: 500 })
  }
}
