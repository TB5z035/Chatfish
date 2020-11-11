import React from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const message = { type: 'normal',
    time: '2019-10-21T06:38:03.063Z',
    from: 'alice',
    content: 'hello' }
  const userInfo = { email: 'b', nickname: 'a' }
  ReactDOM.render(
    <div>
      <Message
        message={message}
        userInfo={userInfo}
        key={message.content + message.time}
      /></div>, div)
})
