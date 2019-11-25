import childProcess from 'child_process'

function execCommand (command: string, path: string, flag?: string) {
  if (!path) throw new Error(`can not get qconf with ${path}`)

  try {
    let result = ''
    if (flag) {
      result = (childProcess.execSync(`qconf ${command} ${path} ${flag}`)).toString()
    } else {
      result = (childProcess.execSync(`qconf ${command} ${path}`)).toString()
    }
    return result.replace(/\n$/, '')
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
