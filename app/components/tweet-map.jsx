import React from 'react'
let GoogleMaps = window.google.maps;

let TweetMap = React.createClass({

  getInitialState() {
    return {
      map: null
    }
  },

  componentDidMount() {
    this.initMap()
  },

  render() {
    return (
      <div ref='mapContainer' className='tweet-map'>
      </div>
    )
  },

  initMap() {
    let cointainer = React.findDOMNode(this.refs.mapContainer)
    let map = new GoogleMaps.Map(cointainer, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8,
      styles: [{
        stylers: [{
          saturation: -100
        }]
      }],
    })

    this.setState({map})
  },

})

export default TweetMap