import qs from 'querystring'
import axios from 'axios'

export const ioFactory = (baseURL, useProxy = false) => {
  const proxyHost = process.env.PROXY_HOST || false
  const socksProxyHost = process.env.SOCKS_PROXY_HOST || false
  const proxyPort = process.env.PROXY_PORT || 1086
  const option = {
    baseURL,
    timeout: 8000
  }
  if (useProxy) {
    if (proxyHost) {
      option.proxy = {
        host: proxyHost,
        port: proxyPort
      }
    } else if (socksProxyHost) {
      const SocksProxyAgent = require('socks-proxy-agent')
      const socksUrl = `socks5://${socksProxyHost}:${proxyPort}`
      option.httpsAgent = new SocksProxyAgent(socksUrl)
    }
  }

  const io = axios.create(option)
  io.interceptors.response.use(function (response) {
    return response.data
  }, function (error) {
    return Promise.reject(error)
  })

  const get = (url, data) => io({
    url,
    params: data,
    paramsSerializer: function (params) {
      return qs.stringify(params)
    }
  })

  const restPost = (url, data) => io({
    method: 'POST',
    url,
    data
  })

  const restPut = (url, data) => io({
    method: 'PUT',
    url,
    data
  })

  const post = (url, data) => io({
    method: 'POST',
    url,
    params: data,
    paramsSerializer: function (params) {
      return qs.stringify(params)
    }
  })

  const deleteMethod = url => io({
    method: 'DELETE',
    url
  })

  return {
    get,
    post,
    delete: deleteMethod,
    restPost,
    restPut
  }
}

export default ioFactory
