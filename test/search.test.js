import search from '../src/search'

search('Hotel.Artemis').then(movie => {
  console.log(movie)
}).catch(err => console.error(err))
