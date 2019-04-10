/**
 * Mysql 配置返回值类型
 * @typedef   {Object} MysqlConf
 * @property  {string} masterHost 主库IP
 * @property  {string} slaveHost  从库IP
 * @property  {string} username   账号
 * @property  {string} password   密码
 * @property  {string} database   数据库名
 */

/**
 * Redis 配置返回值类型
 * @typedef   {Object} RedisConf
 * @property  {string} host      IP地址
 * @property  {string} port      端口号
 */

import qconf from 'node-qconf'
import path from 'path'
import { MysqlConfig, Configs } from 'config'

export class Qconf {
  public flag: string

  public qconf = qconf

  /**
   * 根据 key 获取 qconf 对应的 conf
   * @param   {string} key        配置标识
   * @returns {(null|string)}
   */
  public getConf: (key: string) => null | string

  /**
   * 根据 key 获取 qconf 对应的 host
   * @param   {string} key        配置标识
   * @returns {(null|string)}
   */
  public getHost: (key: string) => null | string

  /**
   * 根据 key 获取对应的 conf
   * @param   {string} key        配置标识
   * @returns {(null|string)}
   */
  private getQconfMapConfig = this.validateQconfMap((_: any, configItem: MysqlConfig) => configItem)

  constructor (
    public configs: Configs,
    public isLocal: boolean = false
  ) {
    this.flag = isLocal ? 'production' : ''
    this.getConf = this.validateQconfMap(this.getQconfConf)
    this.getHost = this.validateQconfMap(this.getQconfHost)
  }

  /**
   * 根据 qconf 路径获取 host
   * @param {string} qconfPath qconf 地址
   * @returns  {(null|string)}
   */
  public getQconfHost = (qconfPath: string) => qconf.getHost(qconfPath, this.flag)

  /**
 * 根据 qconf 路径获取 conf
 * @param   {string} qconfPath qconf 地址
 * @returns  {(null|string)}
 */
  public getQconfConf = (qconfPath: string) => qconf.getConf(qconfPath, this.flag)

  /**
 * 根据 qconf 路径获取 conf
 * @param   {string} qconfPath qconf 地址
 * @returns  {(null|string)}
 */
  public getQconfAllHost = (qconfPath: string) => qconf.getAllHost(qconfPath, this.flag)

  /**
   * 获取 redis 配置信息
   * @param   {string}    key       qconf地址
   * @return  {RedisConf}
   */
  public getRedisConf = (key: string) => {
    const res = this.getHost(key)

    if (res === null) throw new Error(`can not found qconf with key: [${key}]`)

    const [host, port] = res.split(':')

    return {
      host,
      port,
    }
  }

  /**
   * 获取 mysql 配置信息
   * @param   {string}    key       qconf地址
   * @return  {MysqlConf}
   */
  public getMysqlConf = (key: string) => {
    const { database, qconf: qconfPath, modelPath } = this.getQconfMapConfig(key)
    const addQconfPrePath = path.join.bind(null, qconfPath)

    // 获取固定的 qconf 路径，用于拼接 mysql 配置使用的特殊 path
    // addQconfPrePath('master') => /udb/XXX/master
    const masterHostConf = this.getQconfHost(addQconfPrePath('master'))

    const [masterHost] = (masterHostConf || '').split(':')

    if (!masterHostConf) throw new Error(`can not found qconf with key: [${key}]`)

    let slaveHost
    try {
      const slaveHostConf = this.getQconfAllHost(addQconfPrePath('slave'))
      slaveHost = slaveHostConf.map(item => item.split(':')[0])
    } catch (e) {
      // path have not slave conf
      slaveHost = [masterHost]
    }

    const password = this.getQconfConf(addQconfPrePath('password'))
    const username = this.getQconfConf(addQconfPrePath('username'))

    return {
      masterHost,
      slaveHost,
      username,
      password,
      database,
      modelPath,
    }
  }

  /**
   * 检查传入的 key 是否为合规的 qconf map节点
   * qconfPath 作为第一个参数传入，第二个参数为完整的configItem
   * @param {Function} accessCallback 校验成功后的函数调用
   */
  private validateQconfMap (accessCallback: Function) {
    return (key: string) => {
      if (!(key in this.configs)) throw new Error(`can not found conf with key: [${key}]`)

      const configItem = this.configs[key]

      const {
        qconf: qconfPath,
      } = configItem

      if (!qconfPath) throw new Error(`can not found qconf_path with key: [${key}]`)
      return accessCallback(qconfPath, configItem)
    }
  }
}
