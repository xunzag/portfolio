import fs from "node:fs"
import path from "node:path"
import { Experience } from "@/components/Experience"

// Any .glb dropped into public/models is picked up at build time and slotted into the world
// (char-1..3.glb → anime realm; guts.glb is the hero and always present).
function availableModels() {
  try {
    return fs.readdirSync(path.join(process.cwd(), "public", "models")).filter((f) => f.endsWith(".glb"))
  } catch {
    return []
  }
}

export default function Page() {
  return <Experience models={availableModels()} />
}
