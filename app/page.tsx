"use client"

import { Navbar } from "@/components/navbar"
import { UserForm } from "@/components/user-form"
import { PreviewSection } from "@/components/preview-section"
import { ActionButtons } from "@/components/action-buttons"
import { StateIndicator } from "@/components/state-indicator"
import { useAppState } from "@/hooks/use-app-state"

export type FormData = {
  name: string
  jobRole: string
  companyName: string
}

export type AppState = "IDLE" | "FORM_VALID" | "GENERATED" | "SHARE_PENDING" | "SHARE_SUCCESS" | "SHARE_FAILED"

export default function HomePage() {
  const { appState, stateData, transitionTo, updateStateData, resetState, setError, clearError } = useAppState()

  const isFormValid =
    stateData.formData.name.trim().length >= 2 &&
    stateData.formData.jobRole.trim().length >= 2 &&
    stateData.formData.companyName.trim().length >= 2

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">LinkedIn Post & Certificate Generator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Create professional LinkedIn posts and personalized certificates to showcase your achievements and
            expertise.
          </p>

          <StateIndicator appState={appState} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="space-y-6">
            <UserForm
              formData={stateData.formData}
              setFormData={(data) => updateStateData({ formData: data })}
              isFormValid={isFormValid}
              appState={appState}
              transitionTo={transitionTo}
              updateStateData={updateStateData}
              setError={setError}
            />

            <ActionButtons
              appState={appState}
              stateData={stateData}
              transitionTo={transitionTo}
              updateStateData={updateStateData}
              isFormValid={isFormValid}
              setError={setError}
            />
          </div>

          {/* Preview Section */}
          <PreviewSection
            linkedinPost={stateData.linkedinPost}
            setLinkedinPost={(post) => updateStateData({ linkedinPost: post })}
            certificatePreviewUrl={stateData.certificatePreviewUrl}
            appState={appState}
            recipientName={stateData.formData.name}
          />
        </div>

        {(appState === "SHARE_SUCCESS" || appState === "SHARE_FAILED") && (
          <div className="text-center mt-8">
            <button
              onClick={resetState}
              className="text-muted-foreground hover:text-primary transition-colors text-sm underline"
            >
              Start Over
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-card-foreground font-semibold mb-4 md:mb-0">
              © 2024 Incanto Dynamics. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
