import { type NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

declare global {
  var certificateStore: Map<string, any> | undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    console.log("[v0] Certificate generation started for:", name)

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
      console.log("[v0] Invalid name provided:", name)
      return NextResponse.json({ error: "Invalid name provided" }, { status: 400 })
    }

    // Sanitize name (remove HTML, limit length)
    const sanitizedName = name
      .replace(/<[^>]*>/g, "")
      .trim()
      .slice(0, 80)

    console.log("[v0] Sanitized name:", sanitizedName)

    // Generate unique certificate ID
    const certificateId = `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Read the base certificate PDF template
    const pdfPath = join(process.cwd(), "public", "IRI CERTIFICATE .pdf")
    const templateBuffer = readFileSync(pdfPath)

    // Load and edit PDF using pdf-lib
    const pdfDoc = await PDFDocument.load(templateBuffer)
    const page = pdfDoc.getPages()[0]
    const { width, height } = page.getSize()

    // Prepare name text: uppercase, bold, centered
    const nameText = sanitizedName.toUpperCase()
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Choose a font size that matches the certificate; tweak if needed
    const fontSize = 80
    const textWidth = font.widthOfTextAtSize(nameText, fontSize)
    const x = (width - textWidth) / 2

    // Position Y: tuned to sit just below the "Awarded to" ribbon line
    // Coordinates are in PDF points; adjust if your template changes
    // Move slightly lower so it sits just above the underline
    const y = height * 0.44

    page.drawText(nameText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    })

    const editedPdf = await pdfDoc.save()
    console.log("[v0] Edited certificate generated, size:", editedPdf.length)

    // Store certificate data (in a real app, this would be in a database)
    const certificateData = {
      id: certificateId,
      name: sanitizedName,
      buffer: Buffer.from(editedPdf), // final PDF for download
      createdAt: new Date().toISOString(),
      shareStatus: "pending", // pending, success, failed
    }

    if (!globalThis.certificateStore) {
      globalThis.certificateStore = new Map()
    }
    globalThis.certificateStore.set(certificateId, certificateData)

    const previewUrl = `data:application/pdf;base64,${Buffer.from(editedPdf).toString("base64")}`

    console.log("[v0] Certificate generated successfully with ID:", certificateId)

    return NextResponse.json({
      certificateId,
      previewUrl,
      message: "Certificate generated successfully",
    })
  } catch (error) {
    console.error("[v0] Certificate generation error:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
