import _ from 'lodash'
import searchFromTMDb from './search/TMDb'
import decoder from './decoder'
import config from './config'
import { getMagnet } from 'magnet'
import { list } from './source'
import { getValue, setValue } from './storage'

const TrackerExTime = 24 * 60 * 60

const addTrackers = async (movieList) => {
  for (const movie of movieList) {
    movie.link = await getMagnet(movie.link, undefined, undefined, {
      getTracker: async () => {
        const trackers = await getValue('trackers', 'api')
        return trackers || { list: [], time: 0 }
      },
      saveTracker: (list) => {
        return setValue('trackers', list, TrackerExTime, 'api').catch(e => {
          console.error('缓存trackers失败:', e.message)
        })
      },
      replaceTracker: true
    })
  }
  return movieList
}

export const getListByTMDb = () => {
  return getListByRate().then(async movieInfo => {
    const movieList = []
    for (const info of movieInfo) {
      const subject = await searchFromTMDb(info.name)
      const movie = await addTrackers(info.movies)
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
    console.log(`电影列表全部查询成功:共${movieList.length}部电影`)
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
    return _.orderBy(movie, ['movie_info.length', 'tm_db_info.rating_average'], ['desc', 'desc'])
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
  const sortedRateMovie = _.orderBy(movieWithRate, info => info.rate, 'desc')
  return sortedRateMovie.map(info => info.movie)
}

export const getListByRate = () => {
  return list()
    .then(data => {
      return data.map(movie => {
        const info = decoder(movie.title || '')
        return {
          ...info,
          origin_title: movie.title,
          link: movie.magnet
        }
      })
    }).then(movieList => {
      const groupedMovies = _.groupBy(movieList, movie => movie.name)
      return Object.keys(groupedMovies).map(key => {
        const movieShop = groupedMovies[key]
        return {
          name: key,
          movies: getMovieByRate(movieShop)
        }
      })
    })
}
