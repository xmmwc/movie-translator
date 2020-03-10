import Redis from 'ioredis'
import sha1 from 'sha-1'
import config from './config'

const host = process.env.REDIS_URL || 'localhost'
const port = process.env.REDIS_PORT || 6379

let client = null
if (config.useCache) {
  client = new Redis(port, host)

  client.on('error', err => {
    console.error(err.message)
  })
}

export const getMovie = name => {
  if (name) {
    if (config.useCache && client) {
      const id = sha1(name)
      return new Promise(resolve => {
        client.get(id, (err, result) => {
          if (err) return resolve(null)
          try {
            result = JSON.parse(result)
            resolve(result)
          } catch (e) {
            return resolve(null)
          }
        })
      })
    }
  }
  return Promise.resolve(null)
}

export const setMovie = (name, movie, exTime = 12 * 60 * 60) => {
  if (name) {
    if (config.useCache && client) {
      const id = sha1(name)
      return new Promise((resolve, reject) => {
        try {
          const value = JSON.stringify(movie)
          client.set(id, value, 'ex', exTime, (err, result) => {
            if (err) return reject(err)
            resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      })
    }
  }
  return Promise.resolve(null)
}
