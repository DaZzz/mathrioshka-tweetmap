import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import TweetMap from './tweet-map'
import { fetchTweets, removeTweets } from '../actions'

let App = React.createClass({

  componentDidMount() {
    this.props.dispatch(fetchTweets())
  },

  render() {
    let { tweets, dispatch } = this.props

    return (
      <div className='tweet-map-application'>
        <TweetMap tweets={tweets.items}/>
        <button className='button remove-data' onClick={() => dispatch(removeTweets())}>
          Remove
        </button>
      </div>    
    )
  },

})

export default connect(state => state)(App)