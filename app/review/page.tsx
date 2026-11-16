import { ReviewEntrance } from "@/components/review/review-entrance"
import { ReviewShell } from "@/components/review/review-shell"

export const metadata = {
  title: "Review — ok-ai",
  description: "Paste code and run an AI-assisted code review.",
}

export default function ReviewPage() {
  return (
    <ReviewEntrance>
      <ReviewShell />
    </ReviewEntrance>
  )
}
