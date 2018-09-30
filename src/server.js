import express from 'express'
import decoder from './decoder'
import search from './search'
import {list} from './source'

const app = express()

const port = process.env.SERVER_PORT || 19564

const getList = () => {
  return list()
    .then(data => {
      return data.map(movie => {
        const info = decoder(movie.filename)
        return {
          ...info,
          origin_title: movie.filename,
          link: movie.download
        }
      })
    }).then(movieInfo => {
      return Promise.all(movieInfo.map(async movie => {
        const subject = await search(movie.name)
        if (subject) {
          return {
            ...movie,
            cn_name: subject.title,
            rating_average: subject.rating.average,
            rating_star: subject.rating.star,
            subject_year: subject.year,
            image: subject.images,
            douban_id: subject.id
          }
        } else {
          return movie
        }
      }))
    }).then(movie => {
      return movie.map(info => {
        const name = info.cn_name || info.name
        const year = info.year || ''
        const quality = info.quality || ''
        const res = info.res || ''
        const rating = info.rating_average || 'none'
        return {
          ...info,
          show_name: `[${rating}]${name}.${year}.${res}.${quality}`
        }
      })
    })
}

app.get('/list', (req, res, next) => {
  getList()
    .then(movie => {
      res.json({
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
    error: err.message,
    code: err.code || 0
  })
})

app.listen(port, () => {
  console.log(`服务已启动[${port}]`)
})