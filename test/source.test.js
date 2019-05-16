// import { list } from '../src/source'
import { getListByTMDb } from '../src/list'

getListByTMDb().then(data => console.log(data)).catch(err => console.error(err))
