import actionCreator from '../../utils/actionCreator'

// Actions
const appAction = actionCreator('sample')
const SET_FIELD = appAction('SET_FIELD')

const initialState = {
  text: '',
  url: 'https://www.youtube.com/watch?v=4c_IbEBvdH0'
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
  })
}
