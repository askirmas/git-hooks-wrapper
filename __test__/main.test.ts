import { initialize, prettyOut } from "./utils/preparation"
import { mkdirSync, writeFileSync, copyFileSync, appendFileSync } from "fs"
import git from "./utils/git"
import { execFileSync, execSync } from "child_process"
import { resolve } from "path"

const cwd = process.cwd()
, repoDir = resolve(cwd, "repo")
, hooksDir = 'git-hooks'
, filename = "file"

describe('TBD', () => {
  beforeAll(() => initialize(repoDir))
  afterAll(() => process.chdir(cwd))

  it('without hooks', () => {
    mkdirSync(hooksDir)
    writeFileSync(filename, '')
    git.add('.')
    expect(
      git.commit('init')
    ).toHaveLength(
      3
    )
  })
  
  it('ghw init', () => expect(
    prettyOut(execFileSync(`${cwd}/ghw`, ['init', hooksDir]))
  ).toStrictEqual(
    ["Wrapped git hooks in folder 'git-hooks'"]
  ))
  
  it.skip('TBD add false result', () => {
    execSync(`cp -pf ${cwd}/tests/exit0.sh ${hooksDir}/pre-commit`)
    git.add('.').commit('init pre-commit', {"noVerify": true})
    appendFileSync(filename, "Add false result. ")
    git.add('.')
    expect(() =>
      git.commit('wrong')
    ).toThrowError(
      ''
    )
  })

})
