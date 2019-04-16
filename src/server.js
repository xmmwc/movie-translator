import _ from 'lodash'
import express from 'express'
import search from './search'
import config from './config'
import decoder, { getFileName } from './decoder'
import { list } from './source'

const app = express()

const port = process.env.SERVER_PORT || 19564

const getMovieByRate = movies => {
  const movieWithRate = movies.map(movie => {
    const rate = config.movieRate.reduce((total, value) => {
      if (movie.origin_title.indexOf(value.key)) {
        total += value.rate
      }
      return total
    }, 0)
    return {
      rate,
      movie
    }
  })
  const topMovie = _.maxBy(movieWithRate, movie => movie.rate)
  return topMovie.movie
}

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
    }).then(movieList => {
      const groupedMovies = _.groupBy(movieList, movie => movie.name)
      return Object.keys(groupedMovies).map(key => {
        const movieShop = groupedMovies[key]
        if (movieShop.length === 1) {
          return movieShop[0]
        } else {
          return getMovieByRate(movieShop)
        }
      })
    }).then(movieInfo => {
      return Promise.all(movieInfo.map(async movie => {
        const subject = await search(movie.name, false)
        if (subject) {
          const filename = getFileName(movie.origin_title)
          return {
            ...movie,
            cn_name: subject.title,
            cn_title: movie.origin_title.replace(filename, subject.title),
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
        const rating = info.rating_average || 'none'
        return {
          ...info,
          show_name: `[${rating}]${info.cn_title}`
        }
      })
    }).then(movie => {
      return _.orderBy(movie, ['rating_average'], ['desc'])
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
