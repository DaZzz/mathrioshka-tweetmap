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
      left: 50,
      right: 50
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

    // Clip
    context.append('clipPath')
        .attr('id', 'brushclip')
      .append('rect')
        .attr('y', 0)
        .attr('height', height + margin.left + margin.right)

    // Chart 1
    let chart1 = context.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('path')
      .attr('class', 'chart-1')

    let chart10 = context.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('clip-path', 'url(#brushclip)')
      .append('path')
      .attr('class', 'chart-10')

    // Chart 2
    let chart2 = context
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('path')
      .attr('class', 'chart-2')

    let chart20 = context.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('clip-path', 'url(#brushclip)')
      .append('path')
      .attr('class', 'chart-20')

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
    let { brush, x, context, height, width, margin } = this.state
    let [x1, x2] = brush.extent()

    if (Math.abs(x(x1) - x(x2)) < MIN_BRUSH) {
      x1 = x.invert(Math.min(x.range()[1] - MIN_BRUSH, x(x1)))
      x2 = x.invert(x(x1)+MIN_BRUSH)
      brush.extent([x1, x2])
    }

    this.brushClip(x1, x2)
    this.brushLabels(x1, x2)
    this.brushText(x1, x2)
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

    let chart1  = context.select('.chart-1')
    let chart10 = context.select('.chart-10')
    let chart2  = context.select('.chart-2')
    let chart20 = context.select('.chart-20')

    if (shouldAnimateEnter) {
      let zeroes = data.map((d) => ({date: d.date, center: 0, periphery: 0}))
      chart1.datum(zeroes).attr('d', area1)
      chart10.datum(zeroes).attr('d', area1)
      chart2.datum(zeroes).attr('d', area2)
      chart20.datum(zeroes).attr('d', area2)
      brush.extent(x.domain())
      let [x1, x2] = brush.extent()
      this.brushClip(x1, x2)
      this.brushLabels(x1, x2)
      this.brushText(x1, x2)
    }

    chart1.datum(data)
      .transition()
      .attr('d', area1)

    chart10.datum(data)
      .transition()
      .attr('d', area1)

    chart2.datum(data)
      .transition()
      .attr('d', area2)

    chart20.datum(data)
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

  // Draw brush labels
  brushLabels(x1, x2) {
    let {context, height, margin} = this.state

    let format = d3.time.format('%-d %b')
    let labels = ['e', 'w'].map((cl) => context.select(`.resize.${cl}`).selectAll('.label'))

    labels.forEach((l, i) => {
      l.data([i ? x1 : x2]).enter()
        .append('text')
        .attr('class', 'label')
        .attr('font-size', 12)
        .attr('y', height + margin.top)
        .attr('font-family', 'sans-serif')
        .attr('x', i ? -5 : 5)
        .attr('text-anchor', i ? 'end' : 'start')

      l.text((date) => format(date))
    })
  },


  // Draw clipping for brushed area
  brushClip(x1, x2) {
    let {context, width, x} = this.state

    context.select('#brushclip').select('rect')
      .attr('x', isNaN(x(x1)) ? 0 : x(x1))
      .attr('width', isNaN(x(x2)) ? width : x(x2) - x(x1))
  },

  // Add text to brush
  brushText(x1, x2) {
    let {context, x, height, margin} = this.state
    let data =_.filter(this.props.tweets, (d) => (d.date >= x1 && d.date <= x2))
    let centerCount = _.sum(_.map(data, 'center'))
    let peripheryCount = _.sum(_.map(data, 'periphery'))

    let cc = context.selectAll('.center-count')
      .data([centerCount])

    cc.enter()
      .append('text')
      .attr('class', 'center-count')

    cc.text((d) => d)
      // .attr('font-size', function (d) {
      //   console.log(d, this.getBBox().width)

      //   let fs = d3.select(this).attr('font-size')
      //   console.log(fs, Math.max(24, Math.min(42,
      //     (x(x2) - x(x1) - 8) / this.getComputedTextLength() * fs)) + 'px')
      //   fs = isNaN(fs) ? 24 : fs


      //   return Math.max(24, Math.min(42,
      //     (x(x2) - x(x1) - 8) / this.getComputedTextLength() * fs)) + 'px'
      // })
      // .attr('dy', '1em')
      .attr('font-size', 24)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('x', margin.left + x(x1) + (x(x2) - x(x1)) / 2)
      .attr('y', height / 2 + margin.top - 10)

    let pc = context.selectAll('.periphery-count')
      .data([peripheryCount])

    pc.enter()
      .append('text')
      .attr('class', 'periphery-count')

    pc.text((d) => d)
      .attr('font-size', 24)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('x', margin.left + x(x1) + (x(x2) - x(x1)) / 2)
      .attr('y', function() { return height / 2 + this.getBBox().height + margin.top; })

  }
})

export default TweetBrush