import React from 'react'
import d3 from 'd3'
import DATA from '../assets/data.csv'
let GoogleMaps = window.google.maps

let TweetMap = React.createClass({

  getInitialState() {
    return {
      map: null,
      data: null
    }
  },

  componentDidMount() {
    this.loadData()
    // this.initMap()
  },

  render() {
    return (
      <div ref='mapContainer' className='tweet-map'>
      </div>
    )
  },

  loadData() {
    let dsv = d3.dsv(';', 'text/plain')

    dsv(DATA, this.parseRow, (error, data) => {
      this.setState({data})
      this.initMap(data)
    })
  },

  parseRow(d) {
    let tweet = {}

    tweet.isCenter = d.center == '1'
    tweet.date = d3.time.format('%d.%m.%Y').parse(d.date)
    tweet.lng = +(d.long.replace(',', '.'))
    tweet.lat = +(d.lat.replace(',', '.'))

    return tweet
  },

  initMap(data) {
    let container = React.findDOMNode(this.refs.mapContainer)
    let map = new GoogleMaps.Map(container, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8,
      styles: [{
        stylers: [{
          saturation: -100
        }]
      }],
    })

    this.setState({map})
    this.initOverlay(map, data)
  },

  initOverlay(map, data) {
    let overlay = new GoogleMaps.OverlayView()
    // let data = this.state.data

    overlay.onAdd = function () {
      let layer = d3.select(this.getPanes().overlayLayer)
        .append('div')
        .attr('class', 'svg-overlay')

      overlay.draw = function () {
        let projection = this.getProjection()
        let marker = layer.selectAll("svg")
            .data(data)

        console.log('redraw')

        // Enter
        let markerEnter = marker
            .enter()
          .append('svg:svg')
            .attr('class', 'marker')
            .each(transform)

        markerEnter.append('svg:circle')
          .attr('r', 5)
          .attr('cx', 5)
          .attr('cy', 5)

        // Update 
        marker.each(transform)

        // Remove
        marker.exit().remove()

        function transform(d) {
          d = new GoogleMaps.LatLng(d.lat, d.lng)
          d = projection.fromLatLngToDivPixel(d)
          // console.log(d)
          return d3.select(this)
              .style('left', d.x + 'px')
              .style('top', d.y + 'px');
        }
      }
    }

    // console.log(map)
    overlay.setMap(map)
  },



})

export default TweetMap