import d3 from 'd3'
import { combineReducers } from 'redux'
import { REQUEST_TWEETS, RECEIVE_TWEETS, REMOVE_TWEETS, SET_BOUNDS } from '../actions'

function bounds(state = [], action) {
  switch (action.type) {
  case RECEIVE_TWEETS:
    return d3.extent(action.tweets.map((d) => d.date))
  case SET_BOUNDS:
    return action.bounds
  default:
    return state
  }
}

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

  case REMOVE_TWEETS:
    let items = state.items.slice(0, Math.max(10, state.items.length - 10))
    return Object.assign({}, state, { items })

  default:
    return state
  }
}


export default combineReducers({
  tweets,
  bounds
})