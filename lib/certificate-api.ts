export interface CertificateResponse {
  certificateId: string
  previewUrl: string
  message: string
}

export interface CertificateError {
  error: string
}

export async function generateCertificate(name: string): Promise<CertificateResponse> {
  const response = await fetch("/api/generate-certificate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    const error: CertificateError = await response.json()
    throw new Error(error.error || "Failed to generate certificate")
  }

  return response.json()
}

export async function updateShareStatus(certificateId: string, shareStatus: "success" | "failed"): Promise<void> {
  const response = await fetch("/api/certificate/share-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ certificateId, shareStatus }),
  })

  if (!response.ok) {
    const error: CertificateError = await response.json()
    throw new Error(error.error || "Failed to update share status")
  }
}

export function downloadCertificate(certificateId: string): void {
  const downloadUrl = `/api/certificate/download?certificateId=${encodeURIComponent(certificateId)}`
  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = `IncantoDynamics-Certificate.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
