import React, { Component, cloneElement } from 'react'
import ReactDOM from 'react-dom'

class SwipeCards extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      alertLeft: false,
      alertRight: false,
      containerSize: { x: 0, y: 0 }
    }
    this.removeCard = this.removeCard.bind(this)
    this.setSize = this.setSize.bind(this)
  }
  removeCard (side, cardId) {
    const {children, } = this.props
    setTimeout(() => {
      if (side === 'left') this.setState({ alertLeft: false })
      else if (side === 'right') this.setState({ alertRight: false })
    }, 300)
    
    if (children.length === (this.state.index + 1) && this.props.onEnd) this.props.onEnd()
    
    this.setState({
      index: this.state.index + 1,
      alertLeft: side === 'left',
      alertRight: side === 'right'
    })
  }
  
  componentDidMount () {
    this.setSize()
    window.addEventListener('resize', this.setSize)
  }
   componentWillUnmount () {
    window.removeEventListener('resize', this.setSize)
  }

  setSize () {
    const container = ReactDOM.findDOMNode(this)
    const containerSize = {
      x: container.offsetWidth,
      y: container.offsetHeight
    }
    this.setState({ containerSize })
  }

  render () {
    const { alertLeft, alertRight, index, containerSize } = this.state
    const { children, className } = this.props
    if (!containerSize.x || !containerSize.y) return  <div className={className} />

    const _cards = children.reduce((memo, c, i) => {
      if (index > i) return memo
      const props = {
        key: i,
        containerSize,
        index: children.length - index,
        onOutScreenLeft: () => this.removeCard('left'),
        onOutScreenRight: () => this.removeCard('right'),
        active: index === i
      }
      return [ cloneElement(c, props), ...memo ]
    }, [])

    return (
      <div className={className}>
        <div className={`${alertLeft ? 'alert-visible': ''} alert-left alert`} />
        <div className={`${alertRight ? 'alert-visible': ''} alert-right alert`} />
        <div id='cards'>
          {_cards}
        </div>
      </div>
    )
  }
}

export default SwipeCards