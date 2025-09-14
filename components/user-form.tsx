"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { generateLinkedInPost } from "@/lib/linkedin-post-generator"
import { generateCertificate } from "@/lib/certificate-api"
import { getButtonStates } from "@/lib/state-machine"
import type { FormData, AppState } from "@/app/page"
import type { AppStateData } from "@/lib/state-machine"

interface UserFormProps {
  formData: FormData
  setFormData: (data: FormData) => void
  isFormValid: boolean
  appState: AppState
  transitionTo: (newState: AppState, updates?: Partial<AppStateData>) => boolean
  updateStateData: (updates: Partial<AppStateData>) => void
  setError: (error: string) => void
}

export function UserForm({
  formData,
  setFormData,
  isFormValid,
  appState,
  transitionTo,
  updateStateData,
  setError,
}: UserFormProps) {
  const handleInputChange = (field: keyof FormData, value: string) => {
    // Validation: 2-80 chars, strip HTML, Unicode-safe
    const sanitized = value.replace(/<[^>]*>/g, "").slice(0, 80)
    setFormData({ ...formData, [field]: sanitized })
  }

  const handleGenerate = async () => {
    if (!isFormValid) return

    try {
      // Generate LinkedIn post
      const postText = generateLinkedInPost(formData)

      // Generate certificate
      const certificateResponse = await generateCertificate(formData.name)

      // Transition to generated state with new data
      const success = transitionTo("GENERATED", {
        linkedinPost: postText,
        certificateId: certificateResponse.certificateId,
        certificatePreviewUrl: certificateResponse.previewUrl,
      })

      if (!success) {
        setError("Failed to generate content. Please check your inputs.")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate content. Please try again.")
    }
  }

  const handleRegenerate = () => {
    if (!isFormValid) return

    const newPost = generateLinkedInPost(formData)
    updateStateData({ linkedinPost: newPost })
  }

  const buttonStates = getButtonStates(appState, isFormValid, false, true)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground">User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-input"
            maxLength={80}
            required
            disabled={appState === "SHARE_PENDING"}
          />
          <p className="text-xs text-muted-foreground">{formData.name.length}/80 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobRole" className="text-sm font-medium">
            Job Role *
          </Label>
          <Input
            id="jobRole"
            type="text"
            placeholder="e.g., Senior Software Engineer"
            value={formData.jobRole}
            onChange={(e) => handleInputChange("jobRole", e.target.value)}
            className="bg-input"
            maxLength={80}
            required
            disabled={appState === "SHARE_PENDING"}
          />
          <p className="text-xs text-muted-foreground">{formData.jobRole.length}/80 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium">
            Company Name *
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="e.g., Tech Innovations Inc."
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            className="bg-input"
            maxLength={80}
            required
            disabled={appState === "SHARE_PENDING"}
          />
          <p className="text-xs text-muted-foreground">{formData.companyName.length}/80 characters</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={!buttonStates.generateButton.enabled}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {buttonStates.generateButton.loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {buttonStates.generateButton.text}
              </>
            ) : (
              buttonStates.generateButton.text
            )}
          </Button>

          {appState === "GENERATED" && (
            <Button
              onClick={handleRegenerate}
              variant="outline"
              size="icon"
              className="shrink-0 bg-transparent"
              title="Generate new post variation"
              disabled={appState === "SHARE_PENDING"}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
