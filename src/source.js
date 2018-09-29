import ioFactory from './io'

const url = 'https://torrentapi.org/pubapi_v2.php'
const io = ioFactory(url)
const app_id = 'xmmmovie'
let token = null
let token_time = null

const apiGet = (param = {}) => {
  if (isTokenEx()) {
    return io.get('', {...param, token, app_id}).then(data => {
      if (data.error && error_code === 1) {
        return getToken().then(apiGet(param))
      }
      return data
    })
  }
  return getToken().then(apiGet(param))
}

const getToken = async () => {
  console.log('重新获取token')
  const data = await io.get('', {
    get_token: 'get_token',
    app_id
  })
  console.log(data)
  token = data.token
  token_time = new Date().getTime()
  return token
}

const isTokenEx = () => {
  console.log(token)
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
    category: 44,
    min_seeders: 1500
  }).then(data => data.torrent_results)
}


// https://torrentapi.org/pubapi_v2.php?mode=list&category=44&min_seeders=1500&token=6n7egiwd5z&app_id=xmmmovie