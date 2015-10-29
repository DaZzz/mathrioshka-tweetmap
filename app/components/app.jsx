import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { fetchTweets, removeTweets, setBounds } from '../actions'
import _ from 'lodash'
import TweetMap from './tweet-map'
import TweetBrush from './tweet-brush'

let App = React.createClass({

  componentDidMount() {
    this.props.dispatch(fetchTweets())
  },

  render() {
    let { tweets, dispatch, bounds } = this.props

    return (
      <div className='tweet-map-application'>
        <TweetMap tweets={tweets.all} bounds={bounds}/>
        <TweetBrush tweets={tweets.byDate} onBrushChange={(bounds) => dispatch(setBounds(bounds))}/>
      </div>    
    )
  },

})

export default connect(state => state)(App)