import ioFactory from '../io'
import config from '../config'
import { getMovie, setMovie } from '../storage'

const io = ioFactory('https://api.themoviedb.org/3/')

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
 *
 * @param {string} name
 * @returns {Promise<TMDbMovie>}
 */
const search = async name => {
  if (config.useCache) {
    const movieFromCache = await getMovie(name)
    if (movieFromCache) {
      return movieFromCache
    }
  }
  try {
    console.log('重新查询电影信息')
    const data = await io.get('search/movie', {
      query: name,
      language: 'zh-CN',
      api_key: config.apiKey.TMDb
    })
    if (data.total_results > 0) {
      const movie = data.results[0]
      if (movie) {
        if (config.useCache) {
          await setMovie(name, movie).catch(e => {
            console.error('缓存电影失败:', e.message)
          })
        }
        return movie
      }
    }
    console.log('没找到电影信息')
    return null
  } catch (e) {
    console.log(`查询电影信息失败:${e.message}`)
    return null
  }
}

export default search
