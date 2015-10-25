// Write your main app javascript here

import React from 'react'
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

React.render(
  <App/>,
  document.getElementById('app')
)