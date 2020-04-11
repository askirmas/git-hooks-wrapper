import semver from "semver"
import { execSync } from "child_process"

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

describe(semver_inc.name, () => {
  describe('validation', () => {
    const coreNumbers = [0, 1]
    for (const commandIndex in semverCommands)
      for (const major of coreNumbers)
        for (const minor of coreNumbers)
          for (const patch of coreNumbers)
            for (const prerelease of coreNumbers.map(v => v ? `-${v}` : '')) {
              const version = [major, minor, patch].join('.') + prerelease
              , vVersion = `${
                Math.random() > 0.5 ? 'v' : ''
              }${
                version
              }`
              , command = semverCommands[commandIndex]

              it(`${command} ${version}`, () => {
                expect(semver_inc(
                  command, [vVersion]
                )).toBe(
                  semver.inc(version, command)
                )
                if (mySemverCommands[commandIndex])
                  expect(semver_inc(
                    mySemverCommands[commandIndex], [vVersion]
                  )).toBe(
                    semver.inc(version, command)
                  )
              })
            }
  })

  describe("scenario 1", () => {
    const start = "1.0.0"
    , scenario: [iSemverInc, string][] = [
      ["minor", "v1.1.0"],
      ["patch", "v1.1.1"],
      ["preminor", "1.2.0-0"],
      ["patch", "v1.1.2"],
      ["prerelease", "1.2.0-1"],
      ["patch", "v1.1.3"],
      ["minor", "1.2.0"]
    ]

    for (let i = 0; i < scenario.length; i++)
      it(scenario[i].join(' '), () => expect(semver_inc(
        scenario[i][0],
        [start, ...get2nds(scenario.slice(0, i))]
        .sort(semverSort)
      )).toBe(
        _v(scenario[i][1])
      ))

    it.skip("#22 with prerelease", () => expect(semver_inc(
      scenario[3][0],
      [start, ...get2nds(scenario.slice(0, 3))]
      .sort(semverSort)
    )).toStrictEqual(
      get2nds(scenario.slice(3, 5))
      .map(_v)
    ))

    describe.skip("#23 prefeature", () => {
      it("0.1.0", () => expect(semver_inc(
        "prefeature",
        ["0.1.0"]
      )).toBe("0.2.0-0"))
      it("0.1.1", () => expect(semver_inc(
        "prefeature",
        ["0.1.1"]
      )).toBe("0.2.0-0"))
      it("0.2.0-0", () => expect(semver_inc(
        "prefeature",
        ["0.2.0-0"]
      )).toBe("0.2.0-1"))
      it("0.2.1-0", () => expect(semver_inc(
        "prefeature",
        ["0.2.1-0"]
      )).toBe("0.3.0-1"))

      describe.skip("scenario", () => {
        const start = "1.1.0"
        , scenario: [iSemverInc, string][] = [
          ["prefeature" as iSemverInc, "1.2.0-0"],
          ["patch", "v1.1.1"],
          ["prefeature" as iSemverInc, "1.2.0-1"],
        ]
    
        for (let i = 0; i < scenario.length; i++)
          it(scenario[i].join(' '), () => expect(semver_inc(
            scenario[i][0],
            [start, ...get2nds(scenario.slice(0, i))]
            .sort(semverSort)
          )).toBe(
            _v(scenario[i][1])
          ))
      })  
    })
  })
  
  describe("bad command", () => {
    it("release", () => expect(() => semver_inc(
      //@ts-ignore,
      "release",
      ["v0.1.0"]
    )).toThrow())
  })
})

function semver_inc(inc: iAllSemverInc, tags: string[]) {
  return execSync(`echo "${tags.join("\n")}" | xargs -d \\n -n1 echo | ./utils/semver_inc ${inc}`)
  .toString()
  .replace(/\n$/, '')
}

function semverSort(v1: string, v2: string) {
  return v1 === v2 ? 0 : semver.gt(_v(v1), _v(v2)) ? -1 : 1
}

function _v(v: string) {
  return v.replace(/^v/, "")
}

function get2nds<T>(source: [any, T][]) {
  return source.map(([_, value]) => value)
}