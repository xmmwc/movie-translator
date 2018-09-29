import redis from 'ioredis'
import sha1 from 'sha-1'

const client = new redis('127.0.0.1', 6379, {
  enableReadyCheck: false,
  retryStrategy: false
})

client.on('error', err => {
  console.error(err.message)
})

export const getMovie = name => {
  if (client.status === 'ready') {
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
  return Promise.resolve(null)
}

export const setMovie = (name, movie, exTime = 12 * 60 * 60) => {
  if (client.status === 'ready') {
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
  return Promise.reject(new Error('redis is not ready!'))
}