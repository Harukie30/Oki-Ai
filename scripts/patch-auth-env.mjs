import fs from "node:fs"
import crypto from "node:crypto"

const path = ".env"
let env = fs.readFileSync(path, "utf8").replace(/\r\n/g, "\n")
env = env.replace(/\n*# Clerk[\s\S]*$/m, "\n")
env = env.replace(/^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.*$/gm, "")
env = env.replace(/^CLERK_SECRET_KEY=.*$/gm, "")

function ensure(key, value) {
  const re = new RegExp(`^${key}=.*$`, "m")
  if (re.test(env)) return
  env = `${env.trimEnd()}\n${key}=${value}\n`
}

ensure("DATABASE_URL", '"file:./dev.db"')
ensure("BETTER_AUTH_SECRET", crypto.randomBytes(32).toString("hex"))
ensure("BETTER_AUTH_URL", "http://localhost:3000")

fs.writeFileSync(path, `${env.trimEnd()}\n`)
console.log("Updated .env for Better Auth")
