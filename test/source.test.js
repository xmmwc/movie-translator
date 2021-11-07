import _ from 'lodash'
import { list } from '../src/source'
// import { getListByTMDb } from '../src/list'

list().then(data => {
    const group = _.groupBy(data, 'provider')
    console.log(group)
}).catch(err => console.error(err))
