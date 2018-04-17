import React from 'react'
import styled from 'styled-components'
import MessageItem from './MessageItem'
import moment from 'moment'

const MessengerContainer = styled.div`
  background-color: #e9ebee;
  height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden;

  padding-bottom: 30px;
  margin-bottom: 20px;
  position: relative;
`

const Divide = styled.div`
  width: 90%;
  margin: 20px auto;
  border-bottom: 2px solid #888;
  height: 0;
`

const Date = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #e9ebee;
  padding: 0 10px;
`

const MessengerList = ({
  messageList,
  me
}) => (
  <MessengerContainer id='msg-list'>
    <div className='columns'>
      <div className='column'>
        <Divide />
        <Date>
          {moment().format('DD MMM YYYY')}
        </Date>
        {
          messageList.map((data, i) => (
            <MessageItem
              key={i}
              me={me}
              {...data}
            />
          ))
        }

      </div>
    </div>
  </MessengerContainer>
)

export default MessengerList
