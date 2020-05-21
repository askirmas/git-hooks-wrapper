import { execSync } from "child_process"
import { rmdirSync, mkdirSync, writeFileSync, fstat, readdirSync } from "fs"

const repoDir = "repo"

describe('stash_untracked', () => {
  beforeAll(() => {
    rmdirSync(repoDir, {recursive: true})
    mkdirSync(repoDir)
    process.chdir(repoDir)

    execSync(`git init`)

    writeFileSync('init', '')
    execSync(`git add .; git commit -m "init"`)
  })

  afterAll(() => {
    process.chdir('..')
    rmdirSync(repoDir, {recursive: true})
  })
  
})

type tFsStamp = Record<string, string|string[]>

const {isArray} = Array
function writeFsStamp(fs: tFsStamp) {
  for (const filename in fs) {
    const content = fs[filename]
    writeFileSync(
      `${process.cwd()}/${filename}`,
      isArray(content) ? content.join("\n") : content
    )
  }
}
