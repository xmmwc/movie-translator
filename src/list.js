import _ from 'lodash'
import searchFromTMDb from './search/TMDb'
import decoder from './decoder'
import config from './config'
import { list } from './source'

export const getListByTMDb = () => {
  return getListByRate().then(async movieInfo => {
    const movieList = []
    for (const movie of movieInfo) {
      const subject = await searchFromTMDb(movie.name)
      if (subject) {
        movieList.push({
          movie_info: movie,
          tm_db_info: {
            title: subject.title,
            original_title: subject.original_title,
            rating_average: subject.vote_average,
            rating_star: subject.vote_count,
            subject_year: subject.release_date,
            image: subject.poster_path,
            tm_id: subject.id,
            overview: subject.overview,
            popularity: subject.popularity
          }
        })
      }
    }
    return movieList
  }).then(movie => {
    return movie.map(info => {
      const showName = _.isUndefined(info.cn_title) ? info.origin_title : `[${info.rating_average}]${info.cn_title}`
      return {
        ...info,
        show_name: showName
      }
    })
  }).then(movie => {
    return _.orderBy(movie, ['movie_info.group_rate', 'tm_db_info.rating_average'], ['desc', 'desc'])
  })
}

export const getMovieByRate = movies => {
  const movieWithRate = movies.map(movie => {
    const rate = config.movieRate.reduce((total, value) => {
      if (new RegExp(`${value.key}`).test(movie.origin_title)) {
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
  return {
    ...topMovie.movie,
    group_rate: topMovie.rate
  }
}

export const getListByRate = () => {
  return list()
    .then(data => {
      return data.map(movie => {
        const info = decoder(movie.filename || '')
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
        return getMovieByRate(movieShop)
      })
    })
}
