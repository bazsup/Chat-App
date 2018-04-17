import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

const Message = styled.div`
  padding: 10px 0;
  display: flex;
  .name {
    display: inline-block;
    padding: 0 2%;
    min-width: 10%;
    max-width: 25%;
    font-weight: bold;
    transition: all .3s;
  }
  .msg {
    padding: 10px;
    max-width: 70%;
    background: #fff;
    display: inline-block;
    border-radius: 0px 6px 6px 6px;
    .blue {
      color: #209cee;
    }
    img {
      image-orientation: from-image;
    }
  }

  ${props => props.you && `
    .msg {
      background-color: skyblue;
      border-radius: 6px 0 6px 6px;
      .blue {
        color: #000;
      }
    }

    flex-direction: row-reverse;
  `}
`

const fullScreen = (el) => {
  if (el.target.webkitRequestFullScreen) {
    el.target.webkitRequestFullScreen()
  } else {
    el.target.RequestFullScreen()
  }
}

const MessageItem = ({
  user,
  preview,
  message,
  time,
  me,
  pending
}) => (
  <Message
    you={user === me}
  >
    <div className='name'>
      {user === me ? 'You' : user}
    </div>
    <div className='msg'>
      {
        preview && (
          <img onClick={(e) => fullScreen(e)} src={preview} className='image' />
        )
      }
      {
        message === '(y)' ? (
          <i className='far fa-thumbs-up fa-4x blue' />
        ) : message && (
          <div dangerouslySetInnerHTML={{__html: message.replace(/\n/g, '<br />')}} />
        )
      }
      <br />
      {
        pending ? 'กำลังส่ง..' : <b style={{float: 'right'}}>{moment(time).format('hh:mm A')}</b>
      }
    </div>
  </Message>
)

export default MessageItem
