import { execSync } from "child_process"
import { prettyOut } from "./preparation"

type falsy = false | undefined | null | 0 | ""

const {keys: $keys} = Object
, methods = {
  init,
  commit,
  add,
  status,
  stash_branch,
  checkout,
  switch: $switch,
  diff,
  lsFiles
} as const
, handler: ProxyHandler<string[]> = {
  get(target, prop, receiver) {
    return prop in methods 
    ? methods[prop as keyof typeof methods]
    : Reflect.get(target, prop, receiver)
  }     
}
, git = wrap()

export default git

function wrap(cmd_?: string | (falsy|string)[]) {
  const cmd = !Array.isArray(cmd_)
  ? cmd_
  : cmd_.filter(Boolean).join(' ')

  return new Proxy(
    !cmd
    ? []
    : prettyOut(execSync(`git ${cmd}`)),
    handler
  ) as string[] & typeof methods
}

function init() {
  return wrap('init')
}

type CommitOptions = Partial<{
  "noVerify": boolean
}>
function commit(message: string, {noVerify}: CommitOptions = {}) {
  return wrap([
    'commit',
    noVerify && "--no-verify",
    "-m", bashStrEscape(message)
  ])
}

function add(pattern: string) {
  return wrap(["add", pattern])
}

function status() {
  return wrap(`status`)
}

function stash_branch(branch: string, stash?: string|number) {
  return wrap(`stash branch ${bashStrEscape(branch)} ${stash ?? ''}`)
}

function checkout(branch: string) {
  return wrap(`checkout ${bashStrEscape(branch)}`)
}

function $switch(branch: string) {
  return wrap(`switch ${bashStrEscape(branch)}`)
}

type BooleanOpts<T extends string> = Partial<Record<T, boolean>>

type DiffOpts = BooleanOpts<"nameOnly"|"staged"|"exitCode">
function diff(opts?: DiffOpts) {
  return wrap(`diff ${!opts ? '' : obj2opts(opts)}`)
}

type LsFilesOpts = BooleanOpts<"stage"|"deleted"|"modified"|"others"|"excludeStandard">
function lsFiles(opts?: LsFilesOpts) {
  return wrap(`ls-files ${!opts ? '' : obj2opts(opts)}`)
}

function bashStrEscape(str: string|number) {
  return `$'${str.toString().replace("'", "\\'")}'` 
}

type Scalar = undefined|null|boolean|string|number
const FALSY: Set<Scalar> = new Set([null, undefined, false])
, toDashed = /([A-Z])/g
function obj2opts(obj: Record<string,Scalar>) {
  const keys = $keys(obj)
  for (let i = keys.length; i--;) {
    const key = keys[i] 
    , value = obj[key]

    keys[i] = FALSY.has(value)
    ? undefined as unknown as string
    : `--${
      key
      .replace(toDashed, '-$1')
      .toLocaleLowerCase()
    }${
      value === true
      ? ''
      : `=${bashStrEscape(value as unknown as string)}`
    }`
  }

  return keys
  .filter(x => x !== undefined)
  .join(' ')
}