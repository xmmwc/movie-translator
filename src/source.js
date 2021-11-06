import TorrentSearchApi from 'torrent-search-api'
import { setValue, getValue } from './storage'
import config from './config'

const SOURCE_EX_TIME = parseInt(process.env.SOURCE_EX_TIME) || 2 * 60 * 60
// const TOKEN_EX_TIME = 12 * 60 * 60
// const MAX_RETRY_TIME = 5
// const io = ioFactory('https://torrentapi.org')
// const appId = 'xmmmovie'

// let token = null
// let tokenTime = null
// let retryTime = 0

TorrentSearchApi.enablePublicProviders()

TorrentSearchApi.overrideConfig('1337x', {
    categories: {
        TopMovies: 'url:/top-100-movies'
    }
})

TorrentSearchApi.overrideConfig('Torrent9', {
    categories: {
        TopMovies: 'url:/torrents/films'
    }
})

TorrentSearchApi.overrideConfig('Rarbg', {
    categories: {
        TopMovies: '42;46;44'
    }
})

export const searchPublicTorrents = async () => {
    const torrents = await TorrentSearchApi.search(['1337x', 'Torrent9', 'Rarbg'], '1080', 'TopMovies', 50)
    const movies = await Promise.all(torrents.map(async (torrent) => {
        const magnet = await TorrentSearchApi.getMagnet(torrent)
        return {
            torrent,
            magnet
        }
    }))
    return movies
}


export const list = async () => {
    if (config.useCache) {
        const cachedList = await getValue('movie_list', 'api')
        if (cachedList) {
            console.log('读取缓存电影列表成功！')
            return cachedList
        }
    }

    const movies = await searchPublicTorrents()
    const movieList = movies.map(movie => {
        return {
            ...movie.torrent,
            magnet: movie.magnet
        }
    })

    if (config.useCache && movieList.length > 0) {
        await setValue('movie_list', movieList, SOURCE_EX_TIME, 'api').catch(e => {
            console.error('缓存电影列表失败:', e.message)
        })
    }
    return movieList
}


