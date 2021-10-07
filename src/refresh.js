import { getListByTMDb } from './list'
import { scheduleJob } from 'node-schedule'
import { addSeconds, format } from 'date-fns'

const setSchedule = (date) => {
  if (!date) {
    date = new Date()
  }
  const refreshSeconds = +process.env.REFRESH_TIME
  const next = addSeconds(date, refreshSeconds)
  scheduleJob(next, () => {
    const now = new Date()
    const nowStr = format(now, 'yyyy-MM-dd HH:mm:ss')
    setSchedule(now)
    console.log(`\n开始自动刷新接口: ${nowStr}`)
    getListByTMDb().catch((err) => {
      console.error(`查询失败：${err.message}`)
    })
  })
}

export default setSchedule
