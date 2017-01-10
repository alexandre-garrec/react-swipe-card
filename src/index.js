import React, { Component, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import DraggableCard from './DraggableCard'
import SimpleCard from './SimpleCard'
import SwipeCards from './SwipeCards'

export const Card = ({ active = false, ...props }) => {
  const component = active ? DraggableCard : SimpleCard
  return createElement(component, props)
}

export default SwipeCards
