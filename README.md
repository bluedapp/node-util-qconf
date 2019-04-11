# blued-qconf

基于 qconf 的简易封装。

```bash
bnpm install @blued/qconf
```

## Usage

__目前除`mysql`配置以外，其余结构都可以简写为`key: value`，而不需要`key: { qconf: value }`。__  

```typescript
import Qconf from '@blued/qconf'

const configs = {
  mysqlConf: {
    qconf: 'XXX',     // qconf 路径 ⚠️ 无需包涵 /master /slave 的字眼
    database: 'XXX',  // optional 数据库 database
    modelPath: 'XXX', // optional sequelize 模型路径
  },
  redisConf: {
    qconf: 'XXX',     // qconf 路径
  },
  normalHost: {
    qconf: 'XXX',     // qconf 路径
  },
  normalConf: {
    qconf: 'XXX',     // qconf 路径
  },
  redisStringConf: 'XXX',
  normalStringHost: 'XXX',
  normalStringConf: 'XXX'
}

const isLocal = true // 如果需要在本地环境使用线上 qconf 数据，则需要传递一个 boolean 的真值，其他环境下均可忽略该参数

const qconf = new Qconf(config, isLocal)

qconf.getConf('mysqlConf')
```

> 保留 JSON 结构主要是为了后期可能会添加其他的配置，所以没有直接采用 `string`  

## API

### getConf/getHost

> 获取一个`key`所对应的`conf`，`key`必须存在于实例化`qconf`时传入的`configs`。  
> 如不存在则会抛出异常`can not found conf with key: [key]`。 

```typescript
qconf.getConf('key') // => string
qconf.getHost('key') // => string
```

### getQconfHost/getQconfConf/getQconfAllHost

> 根据`qconf`路径获取对应的参数  

```typescript
qconf.getConf('/qconf/xxx/key')         // => string
qconf.getHost('/qconf/xxx/key')         // => string
qconf.getQconfAllHost('/qconf/xxx/key') // => string[]
```

### getRedisConf

> 根据传入的`key`获取 redis 配置

```typescript
qconf.getRedisConf('key') // => { host: 'XXX', port: '1234' }
```

### getMysqlConf

> 根据传入的`key`获取 mysql 配置

```typescript
qconf.getMysqlConf('key')

// 返回值如下
{
  masterHost: 'XXX',              // 主库地址
  slaveHost: ['XXX', 'XXX'],      // 从库地址
  username: 'XXX',                // 用户名
  password: 'XXX',                // 密码
  database: 'XXX' || undefined,   // 数据库
  modelPath: 'XXX' || undefined,  // sequelize 对应的模型地址
}
```