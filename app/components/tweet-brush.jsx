import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'

let TweetBrush = React.createClass({

  componentDidMount() {
    this.initBrush()
  },

  componentDidUpdate() {
    this.componentUpdate()
  },

  render() {
    return (
      <div ref='brushContainer' className='tweet-brush'>
      </div>
    )
  },

  initBrush() {
    let container = ReactDOM.findDOMNode(this.refs.brushContainer)
    let [width, height] = [container.offsetWidth, container.offsetHeight]

    let x = d3.time.scale().range([0, width])
    let y = d3.scale.linear().range([height, 0])

    let brush = d3.svg.brush()
      .x(x)
      .on('brush', this.onBrush)

    let context = d3.select(container).append('svg')
      .attr('class', 'brush-context')

    context.append('g')
      .attr('class', 'brush')

    this.setState({context, brush, container, x, y, width, height})
  },

  onBrush() {
    let { brush } = this.state
    this.props.onBrushChange(brush.extent())
  },

  componentUpdate() {
    let {context, brush, container, x, y, width, height} = this.state
    let data = this.props.tweets
    x.domain(d3.extent(data.map( (d) => d.date )))
    context.select('g.brush')
        .call(brush)
      .selectAll('rect')
        .attr('y', 0)
        .attr('height', height)
  },
})

export default TweetBrush