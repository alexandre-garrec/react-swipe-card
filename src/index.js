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
    const { initialPosition: {x, y} } = this.state
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


var DraggableCard = React.createClass({displayName: "DraggableCard",
    getInitialState: function() {
        return {
            x: 0,
            y: 0,
            initialPosition: {
                x: 0,
                y: 0
            },
            startPosition: {
                x: 0,
                y: 0
            },
            animation: null
        };
    },

    resetPosition: function() {
        var screen = document.getElementById('master-root'),
            card = ReactDOM.findDOMNode(this);

        var initialPosition = {
            x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
            y: Math.round((screen.offsetHeight - card.offsetHeight) / 2)
        };

        var initialState = this.getInitialState();
        this.setState(
            {
                x: initialPosition.x,
                y: initialPosition.y,
                initialPosition: initialPosition,
                startPosition: initialState.startPosition
            }
        );
    },

    panHandlers: {
        panstart: function() {
            this.setState({
                animation: false,
                startPosition: {
                    x: this.state.x,
                    y: this.state.y
                }
            });
        },
        panend: function(ev) {
            var screen = document.getElementById('master-root'),
                card = ReactDOM.findDOMNode(this);

            if (this.state.x < -50) {
                this.props.onOutScreenLeft(this.props.cardId);
            } else if ((this.state.x + (card.offsetWidth - 50)) > screen.offsetWidth) {
                this.props.onOutScreenRight(this.props.cardId);
            } else {
                this.resetPosition();
                this.setState({
                    animation: true
                });
            }
        },
        panmove: function(ev) {
            this.setState(this.calculatePosition(
                ev.deltaX, ev.deltaY
            ));
        },
        pancancel: function(ev) {
            console.log(ev.type);
        }
    },

    handlePan: function(ev) {
        ev.preventDefault();
        this.panHandlers[ev.type].call(this, ev);
        return false;
    },

    handleSwipe: function(ev) {
        console.log(ev.type);
    },

    calculatePosition: function(deltaX, deltaY) {
        return {
            x: (this.state.initialPosition.x + deltaX),
            y: (this.state.initialPosition.y + deltaY)
        };
    },

    componentDidMount: function() {
        this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
        this.hammer.add(new Hammer.Pan({threshold: 0}));

        var events = [
            ['panstart panend pancancel panmove', this.handlePan],
            ['swipestart swipeend swipecancel swipemove',
             this.handleSwipe]
        ];

        events.forEach(function(data) {
            if (data[0] && data[1]) {
                this.hammer.on(data[0], data[1]);
            }
        }, this);

        this.resetPosition();
        window.addEventListener('resize', this.resetPosition);
    },

    componentWillUnmount: function() {
      this.hammer.stop();
      this.hammer.destroy();
      this.hammer = null;

        window.removeEventListener('resize', this.resetPosition);
    },

    render: function() {
        var translate = ''.concat(
            'translate3d(',
            this.state.x + 'px,',
            this.state.y + 'px,',
            '0px)'
        );

        var style = {
            msTransform: translate,
            WebkitTransform: translate,
            transform: translate
        };

        var classes = {
            animate: this.state.animation
        };

        return (React.createElement(Card, React.__spread({},  this.props, 
                {style: style, 
                classes: classes})));
    }
});

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
    }, 3000);

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
        onOutScreenLeft: this.removeCard('left'),
        onOutScreenRight: this.removeCard('right'),
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

module.exports = Tinderable