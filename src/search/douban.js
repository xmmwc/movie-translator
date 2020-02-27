import ioFactory from '../io'
import { getMovie, setMovie } from '../storage'
import config from '../config'

const io = ioFactory('https://api.douban.com/v2/movie/')

const search = async (name) => {
  if (config.useCache) {
    const movieFromCache = await getMovie(name)
    if (movieFromCache) {
      return movieFromCache
    }
  }
  try {
    console.log('重新查询电影信息')
    const data = await io.get('search', {
      q: name,
      start: 0
    })
    if (data.total > 0) {
      const movie = data.subjects[0]
      if (movie) {
        if (config.useCache) {
          await setMovie(name, movie).catch(e => {
            console.error('缓存电影失败:', e.message)
          })
        }
        return movie
      }
    }
    throw new Error('没找到')
  } catch (e) {
    throw new Error(`查询电影失败: ${e.message}`)
  }
}

export default search
