import search from '../src/search'

search('flower and snake zero').then(movie => {
  console.log(movie)
}).catch(err => console.error(err))
