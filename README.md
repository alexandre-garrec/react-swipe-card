# react-swipe-card
Tinder style swipe cards

## Usage

Install

```bash
 $ npm install react-swipe-card -save
```


## Demo

![GIF react-swipe-card](http://g.recordit.co/WBvhHUoJ1l.gif)


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