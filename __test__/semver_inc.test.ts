import semver from "semver"
import { execSync } from "child_process"
import { version } from "../package.json"

const semverCommands = [
  "major", "minor", "patch",
  "premajor", "preminor", "prepatch",
  "prerelease",
] as const
, mySemverCommands = [
  "product", "feature", "hotfix",
  "preproduct", "prefeature", "prehotfix",
] as const

type iSemverInc = typeof semverCommands[number]
type iMySemverInc = typeof mySemverCommands[number]
type iAllSemverInc = iSemverInc | iMySemverInc

/**
 * @param tags Expected desc order in case of `sdtin: string[]`. For `undefined` will be taken list from `git tags` 
 */
function semver_inc(inc: iAllSemverInc, tags?: string[] | string) {
  return execSync(`${
    // STDIN
    Array.isArray(tags)
    ? `echo "${tags.join("\n")}" | xargs -d \\n -n1 echo | `
    : ''
  }./utils/semver_inc ${inc} ${
    // 
    typeof tags === 'string'
    ? tags
    : ''
  }`)
  .toString()
  .replace(/\n$/, '')
}

describe(semver_inc.name, () => {
  describe('validation', () => {
    const coreNumbers = [0, 1]
    for (const commandIndex in semverCommands) {
      const command = semverCommands[commandIndex]
      for (const major of coreNumbers)
        for (const minor of coreNumbers)
          for (const patch of coreNumbers)
            for (const prerelease of coreNumbers.map(v => v ? `-${v}` : '')) {
              const v = [major, minor, patch].join('.') + prerelease

              it(`${command} ${v}`, () => expect(semver_inc(
                command, withV(v)
              )).toBe(semver.inc(
                v, command
              )))
            }
    }
  })

  //TODO Node setup...
  it.skip(`major git`, () => expect(semver_inc(
    "major"
  )).toBe(semver.inc(
    version, "major"
  )))

  describe("own words", () => {
    const suites = {
      "prehotfix": [
        ["0.0.0-0", "0.0.0-1"],
        ["0.0.0",   "0.0.1-0"],
      ],
      "prefeature": [
        ["0.0.0-0", "0.0.0-1"],
        ["0.0.0",   "0.1.0-0"],
        ["0.0.1-0", "0.1.0-0"],
        ["0.0.1",   "0.1.0-0"],
      ],
      "preproduct": [
        ["0.0.0-0", "0.0.0-1"],
        ["0.0.0",   "1.0.0-0"],
        ["0.0.1-0", "1.0.0-0"],
        ["0.0.1",   "1.0.0-0"],
        ["0.1.0-0", "1.0.0-0"],
        ["0.1.0",   "1.0.0-0"],
        ["0.1.1-0", "1.0.0-0"],
        ["0.1.1",   "1.0.0-0"],
      ]
    } as const

    for (const _command in suites) {
      const command = _command as keyof typeof suites
      describe(command, () => {
        for (const [from, to] of suites[command])
          it(from, () => expect(semver_inc(
            command, [from]
          )).toBe(to))
      })
    }
  })

  //TODO extend with feature@preproduct
  describe("scenario 1", () => {
    const start = "1.0.0"
    , scenario: [[iSemverInc, iMySemverInc], [string, string]][] = [
      [
        ["minor", "feature"],
        ["1.1.0", "1.1.0"]
      ], [
        ["patch", "hotfix"],
        ["1.1.1", "1.1.1"]
      ], [
        ["preminor", "prefeature"],
        ["1.2.0-0", "1.2.0-0"]
      ], [
        ["patch", "hotfix"],
        ["1.2.0", "1.1.2"]
      ], [
        ["prerelease", "prefeature"],
        ["1.2.1-0", "1.2.0-1"]
      ], [
        ["patch", "hotfix"],
        ["1.2.1", "1.1.3"]
      ], [
        ["minor", "feature"],
        ["1.3.0", "1.2.0"]
      ]
    ]

    for (let i = 0; i < scenario.length; i++) {
      for (const way of [0, 1]) {
        const command = scenario[i][0][way]
        , result = scenario[i][1][way]
        , versionsList = [start,
          ...get2nds(scenario.slice(0, i))
          .map(v => v[way])
        ]
        .sort(semverSort)
        .map(withV)
  
        it(
          `${command} ${versionsList[0]}`,
          () => {
            if (way === 0)
              expect(semver.inc(
                i === 0 ? start : scenario[i - 1][1][way],
                command as typeof scenario[number][0][0]
              )).toBe(
                result
              )
            expect(semver_inc(
              command,
              versionsList
            )).toBe(
              result
            )
          }
        )
      }
    }

    it.skip("#22 with prerelease", () => expect(semver_inc(
      scenario[3][0][0],
      [start, ...get2nds(get2nds(scenario.slice(0, 3)))]
      .sort(semverSort)
    )).toStrictEqual(
      get2nds(get2nds(scenario.slice(3, 5)))
      .map(_v)
    ))
  })

  describe("bad command", () => {
    for (const badCommand of ["release", "pre_release"])
      it(badCommand, () => expect(() => semver_inc(
        badCommand as iAllSemverInc,
        ["v.1.0"]
      )).toThrow())
  })
})

function semverSort(v1: string, v2: string) {
  return v1 === v2 ? 0 : semver.gt(_v(v1), _v(v2)) ? -1 : 1
}

function _v(v: string) {
  return v.replace(/^v/, "")
}

function get2nds<T>(source: [any, T][]) {
  return source.map(([_, value]) => value)
}

function withV(v: string) {
  return `${
    Math.random() > 0.5 ? 'v' : ''
  }${
    v
  }` 
}