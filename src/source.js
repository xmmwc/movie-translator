import ioFactory from './io'
import { setValue, getValue } from './storage'
import config from './config'

const io = ioFactory('https://torrentapi.org')
const appId = 'xmmmovie'
let token = null
let tokenTime = null

const loadTokenCache = async () => {
  if (config.useCache) {
    const tokenInfo = await getValue('token')
    if (tokenInfo) {
      token = tokenInfo.token
      tokenTime = tokenInfo.tokenTime
    }
  }
}

const apiGet = async (param = {}) => {
  if (isTokenEx()) {
    console.log('开始获取电影！')
    const data = await io.get('/pubapi_v2.php', { ...param, token, app_id: appId })
    if (data.error || data.error_code === 4 || !data.torrent_results) {
      console.warn(`获取电影失败:${data.error}`)
      return {
        torrent_results: []
      }
    }
    console.log(`成功查询到${data.torrent_results.length}条电影记录！`)
    return data
  }
  console.log('token超时！')
  return getToken().then(() => apiGet(param))
}

const getToken = async () => {
  const data = await io.get('/pubapi_v2.php', {
    get_token: 'get_token',
    app_id: appId
  })
  token = data.token
  tokenTime = new Date().getTime()
  console.log('重新获取token:', token, tokenTime)
  if (config.useCache) {
    await setValue('token', { token, tokenTime }).catch(e => {
      console.error('缓存token失败:', e.message)
    })
  }
  return token
}

const isTokenEx = () => {
  if (token && tokenTime) {
    const now = new Date().getTime()
    const distance = tokenTime - now
    return distance < 12 * 60 * 60 * 1000
  }
  return false
}

export const list = async () => {
  if (config.useCache) {
    const cachedList = await getValue('movie_list', 'api')
    if (cachedList) {
      return cachedList
    }
  }

  await loadTokenCache()
  return apiGet({
    mode: 'list',
    category: '42;46;44',
    min_leechers: 100
  }).then(async data => {
    const movieList = data.torrent_results
    if (config.useCache && movieList.length > 0) {
      await setValue('movie_list', movieList, undefined, 'api').catch(e => {
        console.error('缓存电影列表失败:', e.message)
      })
    }
    return movieList
  })
}
