import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { translate3d, backgroundImage } from './utils'

class Card extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initialPosition: { x: 0, y: 0 }
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
    this.setInitialPosition()
    window.addEventListener('resize', this.setInitialPosition)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setInitialPosition)
  }

  render () {
    const { initialPosition: { x, y } } = this.state

    var style = {
      ...translate3d(x, y),
      zIndex: this.props.index,
      backgroundImage: backgroundImage(this.props.image),
      ...this.props.style
    }

    return (
      <div style={style} className={`${this.props.className} card`}>
        <h1>{this.props.title}</h1>
        <p>{this.props.text}</p>
      </div>
    )
  }
}

export default Card
