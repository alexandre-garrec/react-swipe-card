import React, { Component } from 'react'
import Hammer from 'hammerjs'
import ReactDOM from 'react-dom'
import Card from './Card'
import { translate3d } from './utils'

class DraggableCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      initialPosition: { x: 0, y: 0 },
      startPosition: { x: 0, y: 0 },
      animation: null
    }
    this.resetPosition = this.resetPosition.bind(this)
  }
  resetPosition () {
    const screen = document.getElementById('master-root')
    const card = ReactDOM.findDOMNode(this)

    const initialPosition = {
      x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
      y: Math.round((screen.offsetHeight - card.offsetHeight) / 2)
    }

    this.setState({
      x: initialPosition.x,
      y: initialPosition.y,
      initialPosition: initialPosition,
      startPosition: { x: 0, y: 0 }
    })
  }
  
  panstart () {
    this.setState({
      animation: false,
      startPosition: {
        x: this.state.x,
        y: this.state.y
      }
    })
  }
  panend (ev) {
    const screen = document.getElementById('master-root')
    const card = ReactDOM.findDOMNode(this)
    if (this.state.x < -50) {
      this.props.onOutScreenLeft(this.props.cardId)
    } else if ((this.state.x + (card.offsetWidth - 50)) > screen.offsetWidth) {
      this.props.onOutScreenRight(this.props.cardId)
    } else {
      this.resetPosition()
      this.setState({ animation: true })
    }
  }
  panmove (ev) {
    this.setState(this.calculatePosition( ev.deltaX, ev.deltaY ))
  }
  pancancel = (ev) => {
    console.log(ev.type)
  }

  handlePan (ev) {
    ev.preventDefault()
    this[ev.type](ev)
    return false
  }

  handleSwipe (ev) {
    console.log(ev.type)
  }

  calculatePosition (deltaX, deltaY) {
    const { initialPosition : { x, y } } = this.state
    return {
      x: (x + deltaX),
      y: (y + deltaY)
    }
  }
  componentDidMount () {
    this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this))
    this.hammer.add(new Hammer.Pan({threshold: 2}))

    const events = [
      ['panstart panend pancancel panmove', this.handlePan],
      ['swipestart swipeend swipecancel swipemove', this.handleSwipe]
    ]

    events.forEach((data) => {
      if (data[0] && data[1]) {
        this.hammer.on(data[0], (ev) => data[1].call(this, ev))
      }
    })

    this.resetPosition()
    window.addEventListener('resize', this.resetPosition)
  }
  componentWillUnmount () {
    this.hammer.stop()
    this.hammer.destroy()
    this.hammer = null

    window.removeEventListener('resize', this.resetPosition)
  }
  render () {
    const { x, y, animation } = this.state
    const style = translate3d(x, y)
    return <Card {...this.props} style={style} className={animation ? 'animate' : '' } />
  }
}

export default DraggableCard
