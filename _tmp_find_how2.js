const fs = require("fs")
const path =
  "C:/Users/newco/.cursor/projects/d-Github-Oki-Ai/agent-transcripts/fcd02024-41fc-44c8-892e-897007edeeac/fcd02024-41fc-44c8-892e-897007edeeac.jsonl"
const lines = fs.readFileSync(path, "utf8").split(/\n/)

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (!line.includes("How it works")) continue
  if (!line.includes("Choose your language") && !line.includes("Paste your code"))
    continue
  let obj
  try {
    obj = JSON.parse(line)
  } catch {
    continue
  }
  const content = obj?.message?.content
  if (!Array.isArray(content)) continue
  for (const part of content) {
    if (part.type !== "tool_use") continue
    const inp = part.input || {}
    const blob =
      typeof inp.contents === "string"
        ? inp.contents
        : typeof inp.new_string === "string"
          ? inp.new_string
          : ""
    if (!blob.includes("How it works")) continue
    const hasCols = /grid-cols-3|StepColumn|min-h-\[520px\]/.test(blob)
    const hasSteps = /Paste your code|Choose your language/.test(blob)
    if (!hasSteps) continue
    console.log(
      i,
      part.name,
      "cols=" + hasCols,
      "path=" + String(inp.path || "").slice(-50),
      "len=" + blob.length
    )
    if (!hasCols && blob.length > 500) {
      fs.writeFileSync("d:/Github/Oki-Ai/_tmp_how_precols.tsx", blob)
      console.log("wrote candidate")
    }
  }
}
