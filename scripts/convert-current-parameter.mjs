import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const srcFile =
  'C:/Users/LENOVO/.cursor/projects/d-Karnics-Github-Namami-Gange/agent-tools/c848029e-b8aa-4eaf-a532-45caf04d693d.txt'
const outDir = 'd:/Karnics/Github/Namami-Gange/src/assets/current-parameter'
const pageOut = 'd:/Karnics/Github/Namami-Gange/src/pages/CurrentParameter.tsx'

fs.mkdirSync(outDir, { recursive: true })
let text = fs.readFileSync(srcFile, 'utf8')
const cut = text.indexOf('SUPER CRITICAL')
if (cut > 0) text = text.slice(0, cut)

const re =
  /const (img\w+) = "(https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^"]+)";/g
const assets = []
let m
while ((m = re.exec(text)) !== null) {
  assets.push({ name: m[1], url: m[2] })
}

const imports = []
for (let i = 0; i < assets.length; i++) {
  const a = assets[i]
  const ext = a.url.includes('.svg') ? 'svg' : 'png'
  const file = `asset-${i}.${ext}`
  const full = path.join(outDir, file)
  if (!fs.existsSync(full) || fs.statSync(full).size < 10) {
    execSync(`curl.exe -sL -o "${full}" "${a.url}"`, { stdio: 'ignore' })
  }
  imports.push(`import ${a.name} from '@/assets/current-parameter/${file}'`)
}

let code = text.replace(re, '')
code = code.replace(
  /export default function CurrentParameterE/,
  'export default function CurrentParameter',
)
code = `${imports.join('\n')}\n\n${code.trim()}\n`
fs.writeFileSync(pageOut, code)
console.log(`assets ${assets.length} page written`)
