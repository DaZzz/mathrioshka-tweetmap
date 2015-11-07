import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import _ from 'lodash'
import DATA from '../assets/data.csv'
let GoogleMaps = window.google.maps

let TweetMap = React.createClass({

  getInitialState() {
    return {
      map: null,
      overlay: null
    }
  },

  componentDidMount() {
    this.initMap()
  },

  componentDidUpdate() {
    if (this.state.overlay && this.state.overlay.draw) {
      this.state.overlay.draw()
    }
  },

  render() {
    return (
      <div ref='mapContainer' className='tweet-map'>
      </div>
    )
  },

  initMap(data) {
    let container = ReactDOM.findDOMNode(this.refs.mapContainer)
    let map = new GoogleMaps.Map(container, {
      center: {lat: 55.75222, lng: 37.61556},
      zoom: 8,
      styles: [{
        stylers: [{
          saturation: -100
        }]
      }],
    })

    this.setState({map})
    this.initOverlay(map)
  },

  initOverlay(map, data) {
    let overlay = new GoogleMaps.OverlayView()
    let _this = this

    overlay.onAdd = function () {
      let layer = d3.select(this.getPanes().overlayLayer)
        .append('div')
        .attr('class', 'svg-overlay')

      overlay.draw = function () {
        let projection = this.getProjection()
        let data = _this.props.tweets

        if (_this.props.bounds.length > 0) {
          data =_.filter(_this.props.tweets,
                 (d) => (d.date >=_this.props.bounds[0] && d.date <=_this.props.bounds[1]))
        }

        let marker = layer.selectAll('svg')
            .data(data, (d) => d.id)

        // Enter
        let markerEnter = marker.enter()
          .append('svg:svg')
            .attr('width', 20)
            .attr('height', 20)

        markerEnter.append('svg:circle')
            .attr('r', 10)
            .attr('cx', 10)
            .attr('cy', 10)
            .style('fill', (d) => d.isCenter ? '#D88329' : '#0097DC')

        // Update
        marker
          .each(transform)
          .transition()
          //.duration(10)
          //.each('end', function() {d3.select(this).attr('class', 'enter')})
          .attr('class', 'enter')

        // Remove
        marker.exit()
          .attr('class', '')
          .transition()
          .remove()

        function transform(d) {
          d = new GoogleMaps.LatLng(d.lat, d.lng)
          d = projection.fromLatLngToDivPixel(d)
          return d3.select(this)
              .style('left', d.x - 10 + 'px')
              .style('top', d.y - 10 + 'px');
        }
      }
    }

    overlay.setMap(map)
    this.setState({overlay})
  },



})

export default TweetMap