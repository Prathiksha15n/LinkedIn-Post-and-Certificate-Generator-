import { type NextRequest, NextResponse } from "next/server"

declare global {
  var certificateStore: Map<string, any> | undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const certificateId = searchParams.get("certificateId")

    if (!certificateId) {
      return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 })
    }

    if (!globalThis.certificateStore) {
      globalThis.certificateStore = new Map()
    }
    const certificateData = globalThis.certificateStore.get(certificateId)

    if (!certificateData) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Check if LinkedIn share was successful (gated download)
    if (certificateData.shareStatus !== "success") {
      return NextResponse.json(
        { error: "Certificate download not allowed. Please share on LinkedIn first." },
        { status: 403 },
      )
    }

    // Create slug from name for filename
    const nameSlug = certificateData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const filename = `IncantoDynamics-Certificate-${nameSlug}.pdf`

    // Return the PDF file
    return new NextResponse(certificateData.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": certificateData.buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Certificate download error:", error)
    return NextResponse.json({ error: "Failed to download certificate" }, { status: 500 })
  }
}
