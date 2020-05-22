import { execSync } from "child_process"


const methods = {init, commit, add, status, stash_branch, checkout} as const
, handler: ProxyHandler<string[]> = {
  get(target, prop, receiver) {
    return prop in methods 
    ? methods[prop as keyof typeof methods]
    : Reflect.get(target, prop, receiver)
  }     
}
, git = wrap()

export default git

function wrap(cmd?: string) {
  return new Proxy(
    !cmd ? [] : execSync(`git ${cmd}`).toString().split("\n").filter(x => x),
    handler
  ) as string[] & typeof methods
}

function init() {
  return wrap('init')
}

function commit(message: string) {
  return wrap(`commit -m ${bashStrEscape(message)}`)
}

function add(pattern: string) {
  return wrap(`add ${pattern}`)
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


function bashStrEscape(str: string|number) {
  return `$\'${str.toString().replace("'", "\\'")}\'` 
}