import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import addons from 'react-addons'
import Hammer from 'hammerjs'

const translate3d = (x, y) => `translate3d(${x}px, ${y}px, 0px)`
const backgroundImage = url => `url("images/${url}")`

class Card extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initialPosition: {
        x: 0,
        y: 0
      }
    }
    this.setInitialPosition = this.setInitialPosition.bind(this)
  }
  setInitialPosition () {
    const screen = document.getElementById('master-root')
    const card = ReactDOM.findDOMNode(this)

    const initialPosition = {
      x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
      y: Math.round((screen.offsetHeight - card.offsetHeight) / 2)
    }

    this.setState({ initialPosition })
  }

  componentDidMount () {
    this.setInitialPosition();
    window.addEventListener('resize', this.setInitialPosition);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setInitialPosition);
  }

  render () {
    const { initialPosition: { x, y } } = this.state
    const initialTranslate = translate3d(x, y)

    var style = {
      msTransform: initialTranslate,
      WebkitTransform: initialTranslate,
      transform: initialTranslate,
      zIndex: this.props.index,
      backgroundImage: backgroundImage(this.props.image),
      ...this.props.style
    }

    var classes = addons.classSet({
      card: true,
      ...this.props.classes
    })

    return (
      <div style={style} className={classes}>
        <h1>{this.props.title}</h1>
        <p>{this.props.text}</p>
      </div>
    )
  }
}

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
  
  panstart = () => {
    this.setState({
      animation: false,
      startPosition: {
        x: this.state.x,
        y: this.state.y
      }
    })
  }
  panend = (ev) => {
    const screen = document.getElementById('master-root')
    const card = ReactDOM.findDOMNode(this)
    if (this.state.x < -50) {
      this.props.onOutScreenLeft(this.props.cardId)
    } else if ((this.state.x + (card.offsetWidth - 50)) > screen.offsetWidth) {
      this.props.onOutScreenRight(this.props.cardId)
    } else {
      this.resetPosition();
      this.setState({ animation: true })
    }
  }
  panmove = (ev) => {
    this.setState(this.calculatePosition(
      ev.deltaX, ev.deltaY
    ))
  }
  pancancel = (ev) => {
    console.log(ev.type);
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
    ];

    events.forEach((data) => {
      if (data[0] && data[1]) {
        this.hammer.on(data[0], (ev) => data[1].call(this, ev));
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
    const { x, y } = this.state
    const translate = translate3d(x, y)

    const style = {
      msTransform: translate,
      WebkitTransform: translate,
      transform: translate
    }

    const classes = { animate: this.state.animation }

    return <Card {...this.props} style={style} classes={classes} />
  }
}


class Tinderable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: this.props.initialCardsData,
      alertLeft: false,
      alertRight: false
    }
    this.removeCard = this.removeCard.bind(this)
  }
  removeCard (side, cardId) {
    setTimeout(() => {
      if (side === 'left') this.setState({alertLeft: false})
      else if (side === 'right') this.setState({alertRight: false})
    }, 300)

    this.setState({
      cards: this.state.cards.filter(c => c.id !== cardId),
      alertLeft: side === 'left',
      alertRight: side === 'right'
    })
  }

  render () {
    var cards = this.state.cards.map((c, index, coll) => {
      const props = {
        cardId: c.id,
        index: index,
        onOutScreenLeft: () => this.removeCard('left', c.id),
        onOutScreenRight: () => this.removeCard('right', c.id),
        title: c.title,
        text: c.text,
        image: c.image
      }

      const component = (index === (coll.length - 1)) ? DraggableCard : Card

      return React.createElement(component, props);
    })

    const classesAlertLeft = addons.classSet({
      'alert-visible': this.state.alertLeft,
      'alert-left': true,
      'alert': true
    })

    const classesAlertRight = addons.classSet({
      'alert-visible': this.state.alertRight,
      'alert-right': true,
      'alert': true
    })

    return (
      <div>
        <div className={`${classesAlertLeft} left`} />
        <div className={`${classesAlertRight} right`} />
        <div id='cards'>
          {cards}
        </div>
      </div>
    )
  }
}

export default Tinderable
