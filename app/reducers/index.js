import { REQUEST_TWEETS, RECEIVE_TWEETS } from '../actions'


function tweets(state = {
  isFetching: false, 
  items: []
}, action) {
  switch (action.type) {
  case REQUEST_TWEETS:
    return Object.assign({}, state, { isFetching: true })

  case RECEIVE_TWEETS:
    return Object.assign({}, state, {
      isFetching: false,
      items: action.tweets
    })

  default:
    return state
  }
}


export default function rootReducer(state = {}, action) {
  return {
    tweets: tweets(state.tweets, action)
  }
}