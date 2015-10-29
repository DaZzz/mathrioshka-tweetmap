import d3 from 'd3'
import { combineReducers } from 'redux'
import { REQUEST_TWEETS, RECEIVE_TWEETS, REMOVE_TWEETS, SET_BOUNDS } from '../actions'
import _ from 'lodash'

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
  all   : [],
  byDate: []
}, action) {
  switch (action.type) {
  case REQUEST_TWEETS:
    return Object.assign({}, state, { isFetching: true })

  case RECEIVE_TWEETS:
    let byDate = _.values(_.groupBy(action.tweets, 'date'))

    return Object.assign({}, state, {
      isFetching: false,
      all       : action.tweets,
      byDate    : _.chain(byDate)
                   .map((a) => ({
                      date      : a[0].date, 
                      center    : _.filter(a, (el) => el.isCenter).length,
                      periphery : _.filter(a, (el) => !el.isCenter).length,
                    }))
                   .sortBy('date')
                   .value() 
    })

  case REMOVE_TWEETS:
    let all = state.all.slice(0, Math.max(10, state.all.length - 10))
    return Object.assign({}, state, { all })

  default:
    return state
  }
}


export default combineReducers({
  tweets,
  bounds
})