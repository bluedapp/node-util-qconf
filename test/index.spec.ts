/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import Qconf from '../src'

const mysql = {
  pay: '/blued/backend/udb/pay_oversea',
}

const redis = {
  live: '/blued/backend/umem/live',
}

const path = {
  hermes: '/blued/service/hermes/send',
}

describe('normal', () => {
  const qconf = new Qconf({
    mysql: {
      qconf: mysql.pay,
      database: 'test',
      modelPath: 'pay',
    },
    redis: {
      qconf: redis.live,
    },
    path: {
      qconf: path.hermes,
    },
  })

  it(`get host`, done => {
    const res = qconf.getHost('path')

    if (res != null) {
      expect(res).to.be.a('string')
    }
    done()
  })

  it(`get mysql conf`, done => {
    const res = qconf.getMysqlConf('mysql')

    if (res != null) {
      expect(res).to.has.keys(['masterHost', 'slaveHost', 'username', 'password', 'database', 'modelPath'])
    }
    done()
  })

  it(`get redis conf`, done => {
    const res = qconf.getRedisConf('redis')

    if (res != null) {
      expect(res).to.has.keys(['host', 'port'])
    }
    done()
  })

  it(`get none host`, done => {
    try {
      qconf.getHost('none')
    } catch (e) {
      expect(/can not found conf with key: \[none\]/.test(e.message)).to.equal(true)
      done()
    }
  })

  it(`get none conf`, done => {
    try {
      qconf.getConf('none')
    } catch (e) {
      expect(/can not found conf with key: \[none\]/.test(e.message)).to.equal(true)
      done()
    }
  })
})
