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
    let y = d3.scale.linear().range([height * 0.5, 0])

    let brush = d3.svg.brush()
      .x(x)
      .on('brush', this.onBrush)
      .on('brushend', this.onBrush)

    let context = d3.select(container).append('svg')
      .attr('class', 'brush-context')

    // Chart 1
    let chart1 = context.append('g')
      .append('path')
      .attr('class', 'chart-1')
      .style('fill', 'rgba(0,0,255,0.2)')
      .style('stroke', 'blue')

    let chart2 = context.append('g')
      .append('path')
      .attr('class', 'chart-2')
      .style('fill', 'rgba(255,0,0,0.2)')
      .style('stroke', 'red')

    // Brush
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
    x.domain(d3.extent(data, (d) => d.date))
    y.domain(d3.extent(data, (d) => d.center))

    let area1 = d3.svg.area()
      .x((d) => x(d.date))
      .y1((d) => y(d.center))
      .y0(height * 0.5)

    let area2 = d3.svg.area()
      .x((d) => x(d.date))
      .y1((d) => height - y(d.periphery))
      .y0(height * 0.5) 

    context.select('.chart-1')
      .datum(data)
      .attr('d', area1)

    context.select('.chart-2')
      .datum(data)
      .transition()
      .attr('d', area2)

    context.select('g.brush')
        .call(brush)
      .selectAll('rect')
        .attr('y', 0)
        .attr('height', height)
  },
})

export default TweetBrush