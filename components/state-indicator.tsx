"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { getStateDescription } from "@/lib/state-machine"
import type { AppState } from "@/app/page"

interface StateIndicatorProps {
  appState: AppState
}

const STATE_STEPS = [
  { state: "IDLE", label: "Fill Form", step: 1 },
  { state: "FORM_VALID", label: "Generate", step: 2 },
  { state: "GENERATED", label: "Share", step: 3 },
  { state: "SHARE_PENDING", label: "Sharing", step: 3 },
  { state: "SHARE_SUCCESS", label: "Complete", step: 4 },
  { state: "SHARE_FAILED", label: "Retry", step: 3 },
]

export function StateIndicator({ appState }: StateIndicatorProps) {
  const currentStep = STATE_STEPS.find((s) => s.state === appState)?.step || 1
  const progress = ((currentStep - 1) / 3) * 100

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">{getStateDescription(appState)}</p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {[1, 2, 3, 4].map((step) => {
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep
          const isLoading = appState === "SHARE_PENDING" && step === 3

          return (
            <div key={step} className="flex flex-col items-center space-y-1">
              <div className="relative">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle
                    className={`w-6 h-6 ${isCurrent ? "text-primary fill-primary/20" : "text-muted-foreground"}`}
                  />
                )}
              </div>
              <span
                className={`text-xs ${
                  isCompleted || isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {step === 1 && "Form"}
                {step === 2 && "Generate"}
                {step === 3 && "Share"}
                {step === 4 && "Download"}
              </span>
            </div>
          )
        })}
      </div>

      {/* Current State Badge */}
      <div className="text-center">
        <Badge
          variant={
            appState === "SHARE_SUCCESS"
              ? "default"
              : appState === "SHARE_FAILED"
                ? "destructive"
                : appState === "SHARE_PENDING"
                  ? "secondary"
                  : "outline"
          }
        >
          {appState
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
      </div>
    </div>
  )
}
