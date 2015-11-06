import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'


const MIN_BRUSH = 50

let TweetBrush = React.createClass({

  componentDidMount() {
    this.initBrush()
  },

  componentDidUpdate(nextProps) {
    let shouldAnimateEnter = nextProps.tweets.length != this.props.tweets.length
    this.componentUpdate(shouldAnimateEnter)
  },

  render() {
    return (
      <div ref='brushContainer' className='tweet-brush'>
      </div>
    )
  },

  initBrush() {
    let container = ReactDOM.findDOMNode(this.refs.brushContainer)

    let margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    }

    let width = container.offsetWidth - margin.left - margin.right
    let height = container.offsetHeight - margin.top - margin.bottom

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
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('path')
      .attr('class', 'chart-1')

    // Chart 2
    let chart2 = context
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('path')
      .attr('class', 'chart-2')

    // Baseline
    context.append('rect')
      .attr('class', 'baseline')
      .attr('width', width)
      .attr('height', 2)
      .attr('y', margin.top + height/2 - 1)
      .attr('x', margin.left)

    // Brush
    context.append('g')
      .attr('class', 'brush')
      .attr('transform', `translate(${margin.left}, 0)`)

    // Need to call brush after setting params
    this.setState({context, brush, container, x, y, width, height, margin}, this.onBrush)
  },

  onBrush() {
    let { brush, x } = this.state
    let [x1, x2] = brush.extent()

    if (Math.abs(x(x1) - x(x2)) < MIN_BRUSH) {
      x1 = x.invert(Math.min(x.range()[1] - MIN_BRUSH, x(x1)))
      brush.extent([x1, x.invert(x(x1)+MIN_BRUSH)])
    }

    this.props.onBrushChange(brush.extent())
  },

  componentUpdate(shouldAnimateEnter) {
    let {context, brush, container, x, y, width, height, margin} = this.state
    let data = this.props.tweets
    x.domain(d3.extent(data, (d) => d.date))
    y.domain([0, d3.max(data, (d) => d.center)])

    let area1 = d3.svg.area()
      .x((d) => x(d.date))
      .y1((d) => y(d.center))
      .y0(height * 0.5)

    let area2 = d3.svg.area()
      .x((d) => x(d.date))
      .y1((d) => height - y(d.periphery))
      .y0(height * 0.5)

    let chart1 = context.select('.chart-1')
    let chart2 = context.select('.chart-2')

    if (shouldAnimateEnter) {
      let zeroes = data.map((d) => ({date: d.date, center: 0, periphery: 0}))
      chart1.datum(zeroes).attr('d', area1)
      chart2.datum(zeroes).attr('d', area2)
      brush.extent(x.domain())
    }

    chart1.datum(data)
      .transition()
      .attr('d', area1)

    chart2.datum(data)
      .transition()
      .attr('d', area2)

    let h = height + margin.top + margin.bottom

    context.select('g.brush')
        .call(brush)
      .selectAll('rect')
        .attr('y', 0)
        .attr('height', h)

    let resize = context.select('g.brush')
        .selectAll('.resize')

    resize.selectAll('.handle')
        .data([1])
      .enter()
        .append('rect')
        .attr('class', 'handle')
        .attr('height', h)
        .attr('width', 1)

    resize.selectAll('.corner')
        .data([1])
      .enter()
        .append('polygon')
        .attr('class', 'corner')

    context.select('.resize.e .corner')
        .attr('points', (d, i) => `${0},${h} ${0},${h-10} ${10},${h}`)

    context.select('.resize.w .corner')
        .attr('points', (d, i) => `${0},${h} ${0},${h-10} ${-10},${h}`)
  },
})

export default TweetBrush