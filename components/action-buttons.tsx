"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Share2, Download, Loader2, AlertCircle, LogIn } from "lucide-react"
import { downloadCertificate } from "@/lib/certificate-api"
import { getLinkedInAuthUrl, getLinkedInStatus, shareOnLinkedIn, openLinkedInAuth } from "@/lib/linkedin-api"
import { getButtonStates } from "@/lib/state-machine"
import type { AppState } from "@/app/page"
import type { AppStateData } from "@/lib/state-machine"

interface ActionButtonsProps {
  appState: AppState
  stateData: AppStateData
  transitionTo: (newState: AppState, updates?: Partial<AppStateData>) => boolean
  updateStateData: (updates: Partial<AppStateData>) => void
  isFormValid: boolean
  setError: (error: string) => void
}

export function ActionButtons({
  appState,
  stateData,
  transitionTo,
  updateStateData,
  isFormValid,
  setError,
}: ActionButtonsProps) {
  const [authLoading, setAuthLoading] = useState(false)

  // Check LinkedIn authentication status on component mount
  useEffect(() => {
    checkLinkedInStatus()
  }, [])

  const checkLinkedInStatus = async () => {
    try {
      const status = await getLinkedInStatus()
      updateStateData({
        linkedinAuthenticated: status.authenticated,
        linkedinProfile: status.profile || null,
      })
    } catch (error) {
      updateStateData({
        linkedinAuthenticated: false,
        linkedinProfile: null,
      })
    }
  }

  const handleLinkedInAuth = async () => {
    setAuthLoading(true)
    setError("")

    try {
      const authData = await getLinkedInAuthUrl()
      const success = await openLinkedInAuth(authData.authUrl)

      if (success) {
        await checkLinkedInStatus()
      } else {
        setError("LinkedIn authentication was cancelled or failed")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to authenticate with LinkedIn")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleShareLinkedIn = async () => {
    if (!stateData.linkedinAuthenticated) {
      setError("Please authenticate with LinkedIn first")
      return
    }

    // Transition to sharing state
    const success = transitionTo("SHARE_PENDING")
    if (!success) return

    try {
      const shareResponse = await shareOnLinkedIn(stateData.linkedinPost, stateData.certificateId)
      transitionTo("SHARE_SUCCESS")
    } catch (err) {
      transitionTo("SHARE_FAILED", {
        error: err instanceof Error ? err.message : "An error occurred while sharing",
      })
    }
  }

  const handleDownloadCertificate = () => {
    if (appState !== "SHARE_SUCCESS") return

    try {
      downloadCertificate(stateData.certificateId)
    } catch (error) {
      setError("Failed to download certificate. Please try again.")
    }
  }

  const buttonStates = getButtonStates(
    appState,
    isFormValid,
    stateData.linkedinAuthenticated,
    !!stateData.linkedinPost.trim(),
  )

  return (
    <div className="space-y-4">
      {stateData.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{stateData.error}</AlertDescription>
        </Alert>
      )}

      {/* LinkedIn Authentication Status */}
      {stateData.linkedinAuthenticated && stateData.linkedinProfile ? (
        <Alert>
          <LogIn className="h-4 w-4" />
          <AlertDescription>
            Connected to LinkedIn as {stateData.linkedinProfile.firstName} {stateData.linkedinProfile.lastName}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            LinkedIn authentication required to share posts.{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-destructive underline"
              onClick={handleLinkedInAuth}
              disabled={authLoading}
            >
              {authLoading ? "Authenticating..." : "Connect LinkedIn"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {buttonStates.authButton.visible ? (
          <Button
            onClick={handleLinkedInAuth}
            disabled={!buttonStates.authButton.enabled || authLoading}
            className="flex-1 bg-[#0077B5] hover:bg-[#005885] text-white"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                {buttonStates.authButton.text}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleShareLinkedIn}
            disabled={!buttonStates.shareButton.enabled}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {buttonStates.shareButton.loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {buttonStates.shareButton.text}
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                {buttonStates.shareButton.text}
              </>
            )}
          </Button>
        )}

        <Button
          onClick={handleDownloadCertificate}
          disabled={!buttonStates.downloadButton.enabled}
          variant="outline"
          className="flex-1 bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          {buttonStates.downloadButton.text}
        </Button>
      </div>

      {appState === "SHARE_SUCCESS" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Successfully shared on LinkedIn! You can now download your certificate.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
