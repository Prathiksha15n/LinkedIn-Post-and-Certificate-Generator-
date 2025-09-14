"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { validateLinkedInPost, getPostSuggestions } from "@/lib/linkedin-post-generator"
import type { AppState } from "@/app/page"

interface PreviewSectionProps {
  linkedinPost: string
  setLinkedinPost: (post: string) => void
  certificatePreviewUrl: string
  appState: AppState
  recipientName: string
}

export function PreviewSection({
  linkedinPost,
  setLinkedinPost,
  certificatePreviewUrl,
  appState,
  recipientName,
}: PreviewSectionProps) {
  const validation = validateLinkedInPost(linkedinPost)
  const suggestions = getPostSuggestions({ name: "", jobRole: "", companyName: "" })

  return (
    <div className="space-y-6">
      {/* LinkedIn Post Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">LinkedIn Post Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={validation.wordCount <= 300 ? "default" : "destructive"}>
                {validation.wordCount}/300 words
              </Badge>
              {validation.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {appState === "IDLE" || appState === "FORM_VALID" ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Fill out the form to generate your LinkedIn post</p>
            </div>
          ) : (
            <>
              <Textarea
                value={linkedinPost}
                onChange={(e) => setLinkedinPost(e.target.value)}
                placeholder="Your LinkedIn post will appear here..."
                className="min-h-[200px] bg-input resize-none"
                maxLength={3000}
              />

              {!validation.isValid && validation.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

            </>
          )}
        </CardContent>
      </Card>

      {/* Certificate Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Certificate Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {appState === "IDLE" || appState === "FORM_VALID" ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Generate content to see your certificate preview</p>
            </div>
          ) : (
            <div className="relative w-full h-[520px] bg-muted rounded-lg overflow-hidden border border-border">
              {certificatePreviewUrl ? (
                <object data={certificatePreviewUrl + "#toolbar=0&navpanes=0&scrollbar=0"} type="application/pdf" className="w-full h-full">
                  <iframe
                    src={certificatePreviewUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
                    className="w-full h-full"
                    title="Certificate PDF"
                  />
                </object>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Generating preview…</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
