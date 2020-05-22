import {  writeFileSync, readFileSync, mkdirSync, rmdirSync, unlinkSync } from "fs"
import { sync } from 'globby'
import { dirname } from 'path'

type tFsStamp<T = string|string[]> = Record<string, T|string|string[]>

const {isArray} = Array

export {
  writeFsStamp,
  readFsStamp,
}

function writeFsStamp(fs: tFsStamp<null>, opts?: Parameters<typeof writeFileSync>[2]) {
  for (const filename in fs) {
    const dir = dirname(filename)
    , content = fs[filename]

    if (content === null)
      unlinkSync(filename)
    else {
      dir === '.' || mkdirSync(dir, {recursive: true})
      writeFileSync(
        `${process.cwd()}/${filename}`,
        `${isArray(content) ? content.join("\n") : content}\n`,
        opts
      )
    }
  }
}

function readFsStamp(cwd?: string) {
  const files = sync('**/*', {gitignore: true, onlyFiles: true, cwd})
  , $return: tFsStamp = {}
  for (let i = files.length; i--;) {
    const file = files[i]
    , content = readFileSync(`${cwd ?? '.'}/${file}`).toString().split("\n").filter(x => x)
    , {length} = content
    $return[file] = length !== 1
    ? content
    : content[0]
  }
  return $return
}