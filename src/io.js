import qs from 'querystring'
import axios from 'axios'

export const ioFactory = baseURL => {
  const io = axios.create({
    baseURL,
    timeout: 2000
  })

  io.interceptors.response.use(function(response) {
    return response.data
  }, function(error) {
    return Promise.reject(error)
  })

  const get = (url, data) => io({
    url,
    params: data,
    paramsSerializer: function(params) {
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
    paramsSerializer: function(params) {
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