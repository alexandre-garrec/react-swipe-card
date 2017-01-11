import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Cards, { Container, Card } from '../src/index'
import './style.css'

const data = ['Alexandre', 'Thomas', 'Lucien']

storiesOf('Tinder card', module)
  .add('with action', () => (
    <div>
      <h1>react swipe card</h1>
      <Cards onEnd={action('end')} className='master-root'>
        {data.map(item => 
          <Card 
            onSwipeLeft={action('swipe left')} 
            onSwipeRight={action('swipe right')}>
            <h2>{item}</h2>
          </Card>
        )}
      </Cards>
    </div>
  ))