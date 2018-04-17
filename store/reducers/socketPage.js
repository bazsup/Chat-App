/* global FileReader, FormData */
import actionCreator from '../../utils/actionCreator'
import axios from '../../utils/axios'

// Actions
const appAction = actionCreator('socket')
const SET_FIELD = appAction('SET_FIELD')
const ADD_MESSAGE_LIST = appAction('ADD_MESSAGE_LIST')
const SET_MESSAGE_LIST = appAction('SET_MESSAGE_LIST')
const SET_EMPTY_MESSAGE = appAction('SET_EMPTY_MESSAGE')

const initialState = {
  inputUsername: '',
  user: '',
  message: '',
  messageList: [],
  errorMsg: '',
  file: null,
  preview: '',
  allUser: [],
  disabledSend: false
}

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FIELD: {
      return {
        ...state,
        [action.field]: action.value
      }
    }

    case SET_MESSAGE_LIST: {
      return {
        ...state,
        messageList: action.data,
        disabledSend: false
      }
    }

    case ADD_MESSAGE_LIST: {
      return {
        ...state,
        messageList: [
          ...state.messageList,
          action.data
        ],
        disabledSend: true
      }
    }

    case SET_EMPTY_MESSAGE: {
      return {
        ...state,
        message: '',
        preview: null,
        file: null
      }
    }

    default:
      return state
  }
}

// Action Creators
export const actions = {
  setField: (field, value) => ({
    type: SET_FIELD,
    field,
    value
  }),
  onSubmit: (event, socket) => (dispatch, getStore) => {
    event.preventDefault()
    const { inputUsername } = getStore().socketPage
    if (!inputUsername.length) {
      dispatch({
        type: SET_FIELD,
        field: 'errorMsg',
        value: 'Please input username'
      })
    } else {
      socket.emit('setUsername', { username: inputUsername })
    }
  },
  sendMessage: (event, socket) => async (dispatch, getStore) => {
    event.preventDefault()
    const { message, user, preview, file } = getStore().socketPage
    if (message || preview) {
      dispatch({
        type: ADD_MESSAGE_LIST,
        data: {
          message: message.trim(),
          user,
          preview,
          pending: true
        }
      })
      if (file) {
        const form = new FormData()
        const config = {
          headers: {
            'Content-Type': `multipart/form-data`
          }
        }
        form.append('pict', file)
        const resp = await axios.post('/upload', form, config)
        socket.emit('msg', { message, user, path: resp.data.path })
      } else {
        socket.emit('msg', { message, user })
      }
    } else {
      dispatch({
        type: ADD_MESSAGE_LIST,
        data: {
          message: '(y)',
          user,
          pending: true
        }
      })
      socket.emit('msg', { message: '(y)', user })
    }
    const el = document.querySelector('#msg-input')
    setTimeout(() => {
      el.style.cssText = 'height:auto; padding:0'
      el.style.cssText = 'height:' + el.scrollHeight + 'px'
    })

    dispatch({
      type: SET_EMPTY_MESSAGE
    })
  },
  addMessage: (newMessage) => ({
    type: ADD_MESSAGE_LIST,
    data: newMessage
  }),
  changeFile: (event) => (dispatch) => {
    const file = event.target.files[0]
    console.log(event.target.files)
    if (file) {
      var reader = new FileReader()
      reader.onload = function (e) {
        dispatch({
          type: SET_FIELD,
          field: 'preview',
          value: e.target.result
        })
      }

      reader.readAsDataURL(file)
      dispatch({
        type: SET_FIELD,
        field: 'file',
        value: file
      })
    }
  },
  removeFile: () => (dispatch) => {
    dispatch({
      type: SET_FIELD,
      field: 'file',
      value: null
    })
    dispatch({
      type: SET_FIELD,
      field: 'preview',
      value: ''
    })
  },
  setMessageList: (data) => ({
    type: SET_MESSAGE_LIST,
    data
  })
}
