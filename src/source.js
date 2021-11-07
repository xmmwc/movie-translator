import TorrentSearchApi from 'torrent-search-api'
import { setValue, getValue } from './storage'
import config from './config'

const SOURCE_EX_TIME = parseInt(process.env.SOURCE_EX_TIME) || 2 * 60 * 60
const SEARCH_LIMIT = Number(process.env.SEARCH_LIMIT) || 100
const RARBG_APPID = 'rarbg_id' + new Date().getTime().toString()

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
    getTokenUrl: `/pubapi_v2.php?get_token=get_token&app_id=${RARBG_APPID}`,
    searchUrl: `/pubapi_v2.php?app_id=${RARBG_APPID}&category={cat}&mode=list&format=json_extended&sort=seeders&min_leechers=100&token=`,
    categories: {
        TopMovies: '42;46;44'
    }
})


TorrentSearchApi.enableProvider('1337x')
TorrentSearchApi.enableProvider('Torrent9')
TorrentSearchApi.enableProvider('Rarbg')

export const searchPublicTorrents = async () => {
    const torrents = await TorrentSearchApi.search(['1337x', 'Torrent9', 'Rarbg'], '1080', 'TopMovies', SEARCH_LIMIT)
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


