import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Cards, { Container, Card } from '../src/index'
import './style.css'

storiesOf('Tinder card', module)
  .add('with text', () => (
    <div>
      <h1>react swipe card</h1>
      <Cards className='master-root'>
        <Card><h2>Alexandre</h2></Card>
        <Card><h2>Thomas</h2></Card>
        <Card><h2>Lucien</h2></Card>
      </Cards>
    </div>
  ))