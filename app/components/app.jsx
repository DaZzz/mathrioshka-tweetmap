// Write your main app javascript here

import React from 'react'
import ReactDOM from 'react-dom'
import TweetMap from './tweet-map'

let App = React.createClass({
  render() {
    return (
      <div className='tweet-map-application'>
        <TweetMap/>
      </div>    
    )
  },

})

ReactDOM.render(
  <App/>,
  document.getElementById('app')
)