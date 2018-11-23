import ioFactory from './io'

const io = ioFactory('https://torrentapi.org')
const app_id = 'xmmmovie'
let token = null
let token_time = null

const apiGet = (param = {}) => {
  if (isTokenEx()) {
    return io.get('/pubapi_v2.php', {...param, token, app_id}).then(data => {
      if (data.error || data.error_code === 4 || !data.torrent_results) {
        return getToken().then(() => apiGet(param))
      }
      return data
    })
  }
  return getToken().then(() => apiGet(param))
}

const getToken = async () => {
  const data = await io.get('/pubapi_v2.php', {
    get_token: 'get_token',
    app_id
  })
  token = data.token
  token_time = new Date().getTime()
  console.log('重新获取token:', token)
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
    category: '42;44;46;50',
    min_seeders: 500
  }).then(data => {
    return data.torrent_results
  })
}