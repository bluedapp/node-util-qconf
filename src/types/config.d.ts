export interface MysqlConfig {
  host: string[]
  user: string
  password: string
  database: string
  modelPath?: string
  slave?: string
}

export interface RedisConfig {
  key: string
  host: string
}

export interface APIConfig {
  host: string
}

export interface Configs {
  [key: string]: {
    qconf: string,
    database?: string,
    modelPath?: string
  }
}