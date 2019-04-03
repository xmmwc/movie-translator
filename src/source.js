import ioFactory from './io'

const io = ioFactory('https://torrentapi.org')
const app_id = 'xmmmovie'
let token = null
let token_time = null

const apiGet = (param = {}) => {
  if (isTokenEx()) {
    console.log('开始获取电影！')
    return io.get('/pubapi_v2.php', { ...param, token, app_id }).then(data => {
      if (data.error || data.error_code === 4 || !data.torrent_results) {
        return {
          torrent_results: []
        }
      }
      console.log(`成功查询到${data.torrent_results.length}跳电影记录！`)
      return data
    })
  }
  console.log('token超时！')
  return getToken().then(() => apiGet(param))
}

const getToken = async () => {
  const data = await io.get('/pubapi_v2.php', {
    get_token: 'get_token',
    app_id
  })
  token = data.token
  token_time = new Date().getTime()
  console.log('重新获取token:', token, token_time)
  return token
}

const isTokenEx = () => {
  if (token && token_time) {
    const now = new Date().getTime()
    const distance = token_time - now
    return distance < 12 * 60 * 1000
  }
  return false
}

export const list = () => {
  return apiGet({
    mode: 'list',
    category: '42;46',
    min_seeders: 1000
  }).then(data => {
    return data.torrent_results
  })
}