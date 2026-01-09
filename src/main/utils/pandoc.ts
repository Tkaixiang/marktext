// Copy from https://github.com/utatti/simple-pandoc/blob/master/index.js
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import commandExists from 'command-exists'
import { isFile2 } from 'common/filesystem'
import { Readable } from 'stream'

const pandocCommand = 'pandoc'

const envPathExists = (): boolean => {
  return !!process.env.MARKTEXT_PANDOC && isFile2(process.env.MARKTEXT_PANDOC)
}

const getCommand = (): string => {
  if (envPathExists()) {
    return process.env.MARKTEXT_PANDOC as string
  }
  return pandocCommand
}

interface Converter {
  (): Promise<string>
  stream(srcStream: Readable): Readable
}

const pandoc = (from: string, to: string, ...args: string[]) => {
  const command = getCommand()
  const option = ['-s', from, '-t', to].concat(args)

  const converter = (() => new Promise<string>((resolve, reject) => {
    const proc = spawn(command, option) as ChildProcessWithoutNullStreams
    proc.on('error', reject)
    let data = ''
    proc.stdout.on('data', (chunk: Buffer) => {
      data += chunk.toString()
    })
    proc.stdout.on('end', () => resolve(data))
    proc.stdout.on('error', reject)
    proc.stdin.end()
  })) as Converter

  converter.stream = (srcStream: Readable) => {
    const proc = spawn(command, option) as ChildProcessWithoutNullStreams
    srcStream.pipe(proc.stdin)
    return proc.stdout
  }

  return converter
}

pandoc.exists = () => {
  if (envPathExists()) {
    return true
  }
  return commandExists.sync(pandocCommand)
}

export default pandoc
