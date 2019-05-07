// import { list } from '../src/source'
import { getList } from '../src/server'

getList().then(data => console.log(data)).catch(err => console.error(err))
