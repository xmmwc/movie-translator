import { getListByTMDb } from './list'

const refreshAfter = parseInt(process.env.SOURCE_EX_TIME) || 0
let timer = null

const setRefresh = () => {
  if (refreshAfter > 0) {
    const waitTime = refreshAfter * 1000 + 2000
    console.log(`设置自动 ${waitTime}ms 后自动刷新接口`)
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    setTimeout(() => {
      const now = Date.now()
      console.log(`${now}:开始自动刷新接口`)
      getListByTMDb.then(() => {
        setRefresh()
      }).catch(() => {
        setRefresh()
      })
    }, waitTime)
  } else {
    console.warn('忽略刷新时间，刷新接口任务设置失败')
  }
}

export default setRefresh
