
import express from 'express'
import refresh from './refresh'
import { getListByTMDb } from './list'

const app = express()
const port = process.env.SERVER_PORT || 19564

app.get('/list', (req, res, next) => {
  getListByTMDb()
    .then(movie => {
      res.jsonp({
        data: movie,
        code: 1
      })
    })
    .catch(err => {
      next(err)
    })
})

app.use((err, req, res, next) => {
  console.error(err.message)
  res.json({
    message: err.message,
    detail: err.stack,
    code: err.code || 0
  })
})

app.listen(port, () => {
  console.log(`服务已启动[${port}]`)
  refresh()
})
