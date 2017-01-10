import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Cards from '../src/index'
import './style.css'

var data = [
  {title: 'Alexandre', text: '', id: '', image: ''},
  {title: 'Thomas', text: '', id: '', image: ''},
  {title: 'Lucien', text: '', id: '', image: ''}
];

storiesOf('Tinder card', module)
  .add('with text', () => (
    <div id='master-root'>
      <Cards initialCardsData={data} />
    </div>
  ))