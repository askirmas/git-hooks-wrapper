import { execSync } from "child_process"
import { mkdirSync } from "fs"
import git from "./git"

export {
  initialize, prettyOut
}

function initialize(repoDir: string) {
  execSync(`rm -rf ${repoDir}`)
  mkdirSync(repoDir)
  process.chdir(repoDir)
  
  git.init()
}

function prettyOut(x: unknown) {
  return `${x}`.split("\n").filter(Boolean)
}

