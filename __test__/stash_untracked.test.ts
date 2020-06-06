import { mkdirSync } from "fs"
import { execFileSync, execSync } from "child_process"
import {resolve} from 'path'
import { writeFsStamp, readFsStamp } from "./utils/fsstamp"
import git from "./utils/git"

const {values: $values} = Object
, repoDir = "repo"
, cwd = process.cwd()
, scriptName = 'utils/stash_untracked'
, repoFullDir = resolve(cwd, repoDir)
, files = {
  committed: "committed",
  staged: {
    modify: "staged-modify",
    delete: "staged-delete",
  },
  notStaged: {
    delete: "not_staged-delete",
  },
  untracked: {
    staged: "untracked-staged",
    notStaged: "untracked-not_staged",
  }
}
, content = {
  committed: "committed",
  staged: "Staged",
  notStaged: "Not staged",
}
, fss = {
  init: {
    [files.committed]: content.committed,
    [files.staged.delete]: content.committed,
    [files.notStaged.delete]: content.committed,
    [files.staged.modify]: content.committed,
  },
  stage: {
    [files.staged.delete]: null,
    [files.staged.modify]: content.staged,
    [files.untracked.staged]: content.staged,
  },
  commited: {
    [files.committed]: content.committed,
    [files.notStaged.delete]: content.committed,
    [files.staged.modify]: [
      content.committed,
      content.staged
    ],
    [files.untracked.staged]: content.staged,
  },

  notStaged: {
    [files.notStaged.delete]: null,
    [files.staged.modify]: content.notStaged,
    [files.untracked.notStaged]: content.notStaged,
  },
  stashed: {
    [files.committed]: content.committed,
    [files.staged.modify]: [
      content.committed,
      content.staged,
      content.notStaged
    ],
    [files.untracked.notStaged]: content.notStaged,
    [files.untracked.staged]: content.staged,
  }
} 

describe('stash_untracked', () => {
  describe('processing', () => { 
    beforeAll(() => {
      execSync(`rm -rf ${repoDir}`)
      mkdirSync(repoDir)
      process.chdir(repoDir)

      git.init()
    })

    it('init', () => {
      writeFsStamp(fss.init)
      expect(
        git
        .add('.')
        .commit('init')
        .status()
      ).toContain(
        "nothing to commit, working tree clean"
      )
    })

    it('current', () => {
      writeFsStamp(fss.stage, {flag: "a"})

      git.add('.')

      writeFsStamp(fss.notStaged, {flag: "a"})

      return expect_toContainment(
        git.status().map(l => l.trim().replace(/\s{2,}/, ' ')),
        [
          "Changes to be committed:",
          `deleted: ${files.staged.delete}`,
          `modified: ${files.staged.modify}`,
          `new file: ${files.untracked.staged}`,

          "Changes not staged for commit:",
          `deleted: ${files.notStaged.delete}`,
          `modified: ${files.staged.modify}`,

          `Untracked files:`,
          files.untracked.notStaged,
        ]
      )
    })

    //TODO no untracked - no stash
    it(`./${scriptName}`, () => {
      execFileSync(`../${scriptName}`, ["stash"], {cwd: repoFullDir})
      git.commit('next')
      return expect(
        readFsStamp()
      ).toStrictEqual(
        fss.commited
      )
    })

    it('check stash', () => {
      // No staged
      expect(
        git.diff({exitCode: true, nameOnly: true, staged: true})
      ).toEqual(
        []
      )
      
      // No not staged
      expect(
        git.lsFiles({deleted: true, modified: true, others: true, excludeStandard: true})
      ).toEqual(
        []
      )

      git
      .stash_branch('stash')
      .switch('stash')
      .add('.')
      .commit('stash')
      
      return expect(
        readFsStamp()
      ).toStrictEqual(
        fss.stashed
      )
    })


    afterAll(() => {
      process.chdir(cwd)
    })
  })

  describe('specs', () => {
    it('committed only init and stage', () => expect(
      [...new Set($values(fss.commited).flat())].sort()
    ).toStrictEqual(
      [content.committed, content.staged].sort()
    ))
    it('//TODO stashed only init and not staged', () => expect(
      [...new Set($values(fss.stashed).flat())].sort()
    )
    .not
    .toStrictEqual(
      [content.committed, content.notStaged].sort()
    ))  
  })
})

function expect_toContainment(arr1: string[], arr2: string[]) {
  const content = new Set(arr2)
  return expect(
    arr1.filter(x => content.has(x))
  ).toStrictEqual(arr2)
}