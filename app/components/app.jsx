import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import TweetMap from './tweet-map'
import { fetchTweets } from '../actions'

let App = React.createClass({

  componentDidMount() {
    this.props.dispatch(fetchTweets())
  },

  render() {
    console.log(this.props)

    return (
      <div className='tweet-map-application'>
        <TweetMap/>
      </div>    
    )
  },

})

export default connect(state => state)(App)