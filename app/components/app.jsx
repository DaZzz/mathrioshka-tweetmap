import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { fetchTweets, removeTweets, setBounds } from '../actions'
import TweetMap from './tweet-map'
import TweetBrush from './tweet-brush'

let App = React.createClass({

  componentDidMount() {
    this.props.dispatch(fetchTweets())
  },

  render() {
    let { tweets, dispatch } = this.props
    console.log(this.props)
    
    return (
      <div className='tweet-map-application'>
        <TweetMap tweets={tweets.items}/>
        <TweetBrush tweets={tweets.items} onBrushChange={(bounds) => dispatch(setBounds(bounds))}/>

        <button className='button remove-data' onClick={() => dispatch(removeTweets())}>
          Remove
        </button>
      </div>    
    )
  },

})

export default connect(state => state)(App)