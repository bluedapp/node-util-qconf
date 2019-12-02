import childProcess from 'child_process'

function execCommand (command: string, path: string, flag?: string) {
  if (!path) throw new Error(`can not get qconf with ${path}`)

  try {
    const commands = [command, path]

    if (flag) {
      commands.push(flag)
    }

    const commandResult = childProcess.spawnSync('qconf', commands)

    if (commandResult.stderr && commandResult.stderr.toString()) {
      throw new Error(commandResult.stderr.toString())
    }

    return commandResult.stdout.toString().replace(/\n$/, '')
  } catch (e) {
    throw new Error(`can not get qconf with ${path}, message: ${e.message}`)
  }
}

export function getHost (path: string, flag?: string) {
  return execCommand('get_host', path, flag)
}

export function getConf (path: string, flag?: string) {
  return execCommand('get_conf', path, flag)
}

export function getAllHost (path: string, flag?: string) {
  const result = execCommand('get_allhost', path, flag)

  return result.split('\n').filter(i => i)
}

export function getBatchKeys (path: string, flag?: string) {
  const result = execCommand('get_batch_keys', path, flag)

  return result.split('\n').filter(i => i)
}
