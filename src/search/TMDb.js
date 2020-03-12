import ioFactory from '../io'
import config from '../config'
import { getValue, setValue } from '../storage'

const io = ioFactory('https://api.themoviedb.org/3/', true)

/**
 * @typedef TMDbConfiguration
 * @property images {object}
 * @property images.base_url {string}
 * @property images.secure_base_url {string}
 * @property images.backdrop_sizes {array[string]}
 * @property images.logo_sizes {array[string]}
 * @property images.poster_sizes {array[string]}
 * @property images.profile_sizes {array[string]}
 * @property images.still_sizes {array[string]}
 * @property change_keys {array[string]}
 */

/**
 * @typedef TMDbMovie
 * @property poster_path {string}
 * @property adult {boolean}
 * @property overview {string}
 * @property release_date {string}
 * @property genre_ids {array}
 * @property id {string}
 * @property original_title {string}
 * @property original_language {string}
 * @property title {string}
 * @property backdrop_path {string}
 * @property popularity {number}
 * @property vote_count {number}
 * @property video {number}
 * @property vote_average {number}
 */

/**
 * 请求 TMDb Configuration
 * @returns {Promise<TMDbConfiguration>}
 */
const getTMConfigFromServer = async () => {
  const apiKey = config.apiKey.TMDb
  if (apiKey) {
    try {
      const data = await io.get('configuration', {
        api_key: apiKey
      })
      return data
    } catch (error) {
      return null
    }
  }
  return null
}

const getTMConfig = async () => {
  const tmConf = await getValue('tmConfig', 'api')
  if (!tmConf) {
    const tmConfFromServer = await getTMConfigFromServer()
    await setValue('tmConfig', tmConfFromServer).catch(e => {
      console.error('TMDbConfig失败:', e.message)
    })
    return tmConfFromServer
  }
  return tmConf
}

const getPosterPath = async path => {
  const tmConf = await getTMConfig()
  if (tmConf) {
    const images = tmConf.images
    const sizeLength = images.poster_sizes.length
    const posterSize = sizeLength > 2 ? images.poster_sizes[sizeLength - 2] : null
    if (posterSize) {
      return `${images.base_url}${posterSize}${path}`
    }
  }
  return path
}

/**
 * 查询电影
 * @param {string} name
 * @returns {Promise<TMDbMovie>}
 */
const search = async name => {
  if (name) {
    if (config.useCache) {
      const movieFromCache = await getValue(name, 'api')
      if (movieFromCache) {
        return movieFromCache
      }
    }
    try {
      console.log(`开始查询电影信息:${name}`)
      const apiKey = config.apiKey.TMDb
      if (apiKey) {
        const data = await io.get('search/movie', {
          query: name,
          language: 'zh-CN',
          api_key: apiKey
        })
        if (data.total_results > 0) {
          const movie = data.results[0]
          if (movie) {
            movie.poster_path = await getPosterPath(movie.poster_path)
            if (config.useCache) {
              await setValue(name, movie, undefined, 'api').catch(e => {
                console.error('缓存电影失败:', e.message)
              })
            }
            return movie
          }
        }
        console.log('没找到电影信息')
      }
      return null
    } catch (e) {
      console.log(`查询电影信息失败:${e.message}`)
      return null
    }
  }
  return null
}

export default search
