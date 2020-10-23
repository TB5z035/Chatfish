import React from 'react'
import ReactDOM from 'react-dom'
import NotificationListItem from './NotificationListItem'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const name = 'bob'
  ReactDOM.render(
    <div>
      <NotificationListItem
        name={name}
        isGroup={false}
        friendName={''}
        key={name}
      /></div>, div)
})
