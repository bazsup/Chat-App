import React from 'react'
import socket from '../utils/socket-client'
import { compose, lifecycle } from 'recompose'
import { connect } from 'react-redux'
import { actions as socketActions } from '../store/reducers/socketPage'
import MessageList from './Messenger/MessengerList'
import MessageInput from './Messenger/MessageInput'

const HelloSocket = (props) => (
  <div>
    <div className='container'>
      <div className='section'>
        <div className='columns'>
          <div className='column'>
            <h1 className='title is-1'>Chatting App</h1>
            {
              props.socketPage.user
                ? <Chatting {...props} />
                : <FormRegisterUser {...props} />
            }
          </div>
          {
            props.socketPage.user && (
              <div>
                <hr />
                <div className='column content'>
                  <h3>Online user</h3>
                  <ul>
                    {
                      props.socketPage.allUser.map((user) => (
                        <li key={user}>{user}</li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            )
          }

        </div>
      </div>
    </div>
  </div>
)

const Chatting = ({
  socketPage: {
    user,
    message,
    messageList,
    file,
    preview,
    disabledSend
  },
  sendMessage,
  setField,
  changeFile,
  removeFile
}) => (
  <div>
    <h2 className='title is-4'>You are connected with user: {user} </h2>
    <form
      onSubmit={e => sendMessage(e, socket)}
    >
      <div className='columns'>
        <div className='column' style={{position: 'relative'}}>
          <MessageList
            messageList={messageList}
            me={user}
          />
          <MessageInput
            message={message}
            setField={setField}
            sendMessage={sendMessage}
            changeFile={changeFile}
            file={file}
            preview={preview}
            removeFile={removeFile}
            disabledSend={disabledSend}
          />
        </div>
      </div>
    </form>
  </div>
)

const FormRegisterUser = ({
  onSubmit,
  setField,
  socketPage: {
    inputUsername,
    errorMsg
  }
}) => (
  <form onSubmit={e => onSubmit(e, socket)}>
    <div className='columns'>
      <div className='column'>
        <div className='field has-addons'>
          <div className='control is-expanded'>
            <input
              className='input is-fullwidth'
              type='text'
              value={inputUsername}
              onChange={e => setField('inputUsername', e.target.value)}
              placeholder='Please input your name'
            />
          </div>
          <div className='control'>
            <button className='button is-info'>เชื่อมต่อ!</button>
          </div>
        </div>
      </div>
    </div>
    {
      !inputUsername && errorMsg && (
        <div className='notification is-danger'>
          {errorMsg}
        </div>
      )
    }
  </form>
)

export default compose(
  connect(
    state => ({
      socketPage: state.socketPage
    }),
    { ...socketActions }
  ),
  lifecycle({
    componentDidMount () {
      socket.on('connect', () => {
        console.log('connected')
      })

      socket.on('userSet', ({ username }) => {
        this.props.setField('user', username)
        setTimeout(() => {
          const el = document.querySelector('#msg-list')
          const height = el.scrollHeight
          el.scrollTo({top: height})
        }, 0)
      })

      socket.on('userExists', (msg) => {
        this.props.setField('inputUsername', '')
        this.props.setField('errorMsg', msg)
      })

      socket.on('newMsg', ({data, user}) => {
        this.props.setMessageList(data)
      })

      socket.on('setUser', (data) => {
        this.props.setField('allUser', data)
      })
    },
    componentWillReceiveProps (nextProps) {
      if (nextProps.socketPage.messageList.length !== this.props.socketPage.messageList.length) {
        setTimeout(() => {
          const el = document.querySelector('#msg-list')
          if (el) {
            const height = el.scrollHeight
            el.scrollTo({top: height, behavior: 'smooth'})
          }
        }, 0)
      }
    }
  })
)(HelloSocket)
