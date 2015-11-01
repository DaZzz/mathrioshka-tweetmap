import d3 from 'd3' 
import DATA from '../assets/data.csv'

export const REQUEST_TWEETS = 'REQUEST_TWEETS'
function requestTweets() {
  return {
    type: REQUEST_TWEETS,
  }
}

export const RECEIVE_TWEETS = 'RECEIVE_TWEETS'
function receiveTweets(tweets) {
  return {
    type: RECEIVE_TWEETS,
    tweets: tweets,
  }
}


let shouldFetchOtherData = false
export function fetchTweets() {
  return (dispatch) => {
    dispatch(requestTweets())

    let dsv = d3.dsv(';', 'text/plain')
    let parseRow = (d) => {
      let tweet = {}

      tweet.isCenter = d.center == '1'
      tweet.date = d3.time.format('%d.%m.%Y').parse(d.date)
      tweet.lng = +(d.long.replace(',', '.'))
      tweet.lat = +(d.lat.replace(',', '.'))

      return tweet
    }

    // Usualy they return promise here
    dsv(DATA, parseRow, (error, tweets) => {
      let sortedTweets = tweets.sort((a, b) => a.date - b.date)
      let l = sortedTweets.length 
      sortedTweets = !shouldFetchOtherData ? 
                      sortedTweets.slice(0, Math.floor(l / 2)) :
                      sortedTweets.slice(Math.floor(l / 2), l-1)

      shouldFetchOtherData = !shouldFetchOtherData

      console.log(shouldFetchOtherData)
      dispatch(receiveTweets(sortedTweets))
    })
  }
}

export const SET_BOUNDS = 'SET_BOUNDS'
export function setBounds(bounds) {
  return {
    type: SET_BOUNDS,
    bounds,
  }
}