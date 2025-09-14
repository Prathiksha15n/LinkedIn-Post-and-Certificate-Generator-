export async function generateCertificatePDF(name: string): Promise<Buffer> {
  // Create a simple certificate as a data URL
  // In production, you'd use a proper PDF library like PDFKit or Puppeteer

  const certificateHTML = `
    <div style="
      width: 800px; 
      height: 600px; 
      background: white; 
      border: 8px solid #1e3a8a; 
      position: relative;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px;
      box-sizing: border-box;
    ">
      <div style="border: 2px solid #F9B048; width: 100%; height: 100%; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #1e3a8a; font-size: 36px; font-weight: bold; margin: 0 0 20px 0;">CERTIFICATE OF COMPLETION</h1>
        <h2 style="color: #374151; font-size: 24px; margin: 0 0 40px 0;">Professional Development Program</h2>
        <p style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">This certifies that</p>
        <h3 style="color: #1e3a8a; font-size: 42px; font-weight: bold; margin: 0 0 40px 0; text-transform: uppercase;">${name}</h3>
        <p style="color: #374151; font-size: 18px; margin: 0 0 10px 0;">has successfully completed the</p>
        <p style="color: #374151; font-size: 18px; margin: 0 0 40px 0;">Advanced Professional Development Program</p>
        <p style="color: #374151; font-size: 16px; margin: 0 0 60px 0;">Completed on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: end;">
          <div style="color: #1e3a8a; font-size: 20px; font-weight: bold;">INCANTO DYNAMICS</div>
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #374151; width: 200px; margin-bottom: 5px;"></div>
            <div style="color: #374151; font-size: 14px;">Program Director</div>
          </div>
        </div>
      </div>
    </div>
  `

  // Convert HTML to base64 (simplified approach for demo)
  const base64Data = Buffer.from(certificateHTML).toString("base64")
  return Buffer.from(base64Data, "base64")
}
