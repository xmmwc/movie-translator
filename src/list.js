import _ from 'lodash'
import searchFromDouban from './search/douban'
import searchFromTMDb from './search/TMDb'
import config from './config'
import decoder, { getFileName } from './decoder'
import { list } from './source'

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

export const getListByDounban = () => {
  return getListByRate().then(movieInfo => {
    return Promise.all(movieInfo.map(async movie => {
      const subject = await searchFromDouban(movie.name)
      if (subject) {
        const filename = getFileName(movie.origin_title)
        return {
          ...movie,
          cn_name: subject.title,
          cn_title: movie.origin_title.replace(filename, subject.title),
          rating_average: subject.rating.average,
          rating_star: subject.rating.stars,
          subject_year: subject.year,
          image: subject.images,
          douban_id: subject.id
        }
      } else {
        return {
          ...movie,
          rating_average: 0
        }
      }
    })).catch(err => {
      console.error(err)
      return []
    })
  }).then(movie => {
    return movie.map(info => {
      const showName = _.isUndefined(info.rating_average) ? info.origin_title : `[${info.rating_average}]${info.cn_title}`
      return {
        ...info,
        show_name: showName
      }
    })
  }).then(movie => {
    return _.orderBy(movie, ['group_rate', 'rating_average'], ['desc', 'desc'])
  })
}

export const getListByTMDb = () => {
  return getListByRate().then(movieInfo => {
    return Promise.all(movieInfo.map(async movie => {
      const subject = await searchFromTMDb(movie.name)
      if (subject) {
        const filename = getFileName(movie.origin_title)
        return {
          ...movie,
          cn_name: subject.title,
          cn_title: movie.origin_title.replace(filename, subject.title),
          rating_average: subject.vote_average,
          rating_star: subject.vote_count,
          subject_year: subject.release_date,
          image: subject.poster_path,
          tm_id: subject.id
        }
      } else {
        return {
          ...movie,
          rating_average: 0
        }
      }
    })).catch(err => {
      console.error(err)
      return []
    })
  }).then(movie => {
    return movie.map(info => {
      const showName = _.isUndefined(info.rating_average) ? info.origin_title : `[${info.rating_average}]${info.cn_title}`
      return {
        ...info,
        show_name: showName
      }
    })
  }).then(movie => {
    return _.orderBy(movie, ['group_rate', 'rating_average'], ['desc', 'desc'])
  })
}

export const getListByRate = () => {
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
        return getMovieByRate(movieShop)
      })
    })
}
