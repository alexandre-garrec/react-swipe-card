# react-swipe-card
Tinder style swipe cards


## Demo

![GIF react-swipe-card](http://g.recordit.co/WBvhHUoJ1l.gif)

## Usage

Install

```bash
 $ npm install react-swipe-card -save
```

Code

```javascript
import Cards, { Card } from 'react-swipe-card'

const Wrapper = () => {
  return (
    <Cards className='master-root'>
      <Card><h2>Alexandre</h2></Card>
      <Card><h2>Thomas</h2></Card>
      <Card><h2>Lucien</h2></Card>
    </Cards>
  )
}
```