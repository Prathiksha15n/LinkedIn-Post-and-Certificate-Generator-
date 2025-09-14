"use client"

import { useState, useCallback, useEffect } from "react"
import { type AppState, type AppStateData, canTransition, validateStateTransition } from "@/lib/state-machine"

export function useAppState() {
  const [appState, setAppState] = useState<AppState>("IDLE")
  const [stateData, setStateData] = useState<AppStateData>({
    formData: { name: "", jobRole: "", companyName: "" },
    linkedinPost: "",
    certificateId: "",
    certificatePreviewUrl: "",
    error: "",
    linkedinAuthenticated: false,
    linkedinProfile: null,
  })

  // State transition with validation
  const transitionTo = useCallback(
    (newState: AppState, updates?: Partial<AppStateData>) => {
      const updatedData = updates ? { ...stateData, ...updates } : stateData

      // Validate transition
      if (!canTransition(appState, newState)) {
        console.warn(`Invalid state transition: ${appState} -> ${newState}`)
        return false
      }

      // Validate state requirements
      const validation = validateStateTransition(appState, newState, updatedData)
      if (!validation.valid) {
        setStateData((prev) => ({ ...prev, error: validation.error || "Invalid state transition" }))
        return false
      }

      // Clear error on successful transition
      const finalData = { ...updatedData, error: "" }

      setAppState(newState)
      setStateData(finalData)
      return true
    },
    [appState, stateData],
  )

  // Update state data without changing app state
  const updateStateData = useCallback((updates: Partial<AppStateData>) => {
    setStateData((prev) => ({ ...prev, ...updates }))
  }, [])

  // Form validation effect
  useEffect(() => {
    const { name, jobRole, companyName } = stateData.formData
    const isFormValid = name.trim().length >= 2 && jobRole.trim().length >= 2 && companyName.trim().length >= 2

    if (appState === "IDLE" && isFormValid) {
      transitionTo("FORM_VALID")
    } else if (appState === "FORM_VALID" && !isFormValid) {
      transitionTo("IDLE")
    }
  }, [stateData.formData, appState, transitionTo])

  // Reset to initial state
  const resetState = useCallback(() => {
    setAppState("IDLE")
    setStateData({
      formData: { name: "", jobRole: "", companyName: "" },
      linkedinPost: "",
      certificateId: "",
      certificatePreviewUrl: "",
      error: "",
      linkedinAuthenticated: false,
      linkedinProfile: null,
    })
  }, [])

  // Error handling
  const setError = useCallback((error: string) => {
    setStateData((prev) => ({ ...prev, error }))
  }, [])

  const clearError = useCallback(() => {
    setStateData((prev) => ({ ...prev, error: "" }))
  }, [])

  return {
    appState,
    stateData,
    transitionTo,
    updateStateData,
    resetState,
    setError,
    clearError,
  }
}
