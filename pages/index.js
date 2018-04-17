import React from 'react'
import MainComponent from '../components/Main'
import withRedux from '../store/wrapper'

const Index = (props) => (
  <div>
    <MainComponent {...props} />
  </div>
)

export default withRedux()(Index)
