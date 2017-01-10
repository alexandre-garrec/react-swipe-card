import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import DraggableCard from './DraggableCard'
import Card from './Card'

export const Container = ({children}) => <div id='master-root'>{children}</div>

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
    const { cards, alertLeft, alertRight } = this.state

    const _cards = cards.map((c, index, coll) => {
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

      return React.createElement(component, props)
    })

    return (
      <div>
        <div className={`${alertLeft ? 'alert-visible': ''} alert-left alert`} />
        <div className={`${alertRight ? 'alert-visible': ''} alert-right alert`} />
        <div id='cards'>
          {_cards}
        </div>
      </div>
    )
  }
}

export default Tinderable
