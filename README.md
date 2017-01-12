# react-swipe-card
Tinder style swipe cards

 - [Usage](#usage)
 - [Demo](#demo)
 - [Code](#code)
 - [Components](#components)

## Usage

Install

```bash
 $ npm install react-swipe-card -save
```


## Demo
[Demo](https://alexandre-garrec.github.io/react-swipe-card/)

![GIF react-swipe-card](http://g.recordit.co/WBvhHUoJ1l.gif = 250x)


## Code

```javascript
import Cards, { Card } from 'react-swipe-card'


const data = ['Alexandre', 'Thomas', 'Lucien']

const Wrapper = () => {
  return (
	  <Cards onEnd={action('end')} className='master-root'>
        {data.map(item => 
          <Card 
            onSwipeLeft={action('swipe left')} 
            onSwipeRight={action('swipe right')}>
            <h2>{item}</h2>
          </Card>
        )}
      </Cards>
    </Cards>
  )
}
```

## Components

Cards
---
Props

 - className: string
 - onEnd: function

Card
---
props

 - onSwipeLeft: function
 - onSwipeRight: function