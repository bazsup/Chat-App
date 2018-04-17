import React, { Component } from 'react'
import videojs from 'video.js'
import 'videojs-youtube'
import socket from '../../utils/socket-client'
import event from './event'

class Player extends Component {
  state = {
    previousTime: 0,
    currentTime: 0,
    seekStart: null,
    id: ''
  }

  componentDidMount () {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady () {
      // console.log('onPlayerReady', this)
      socket.emit('ready')
    })
    this.socket = socket
    event(this)
    window.player = this.player
  }

  componentWillReceiveProps (nextProps) {
    const newSource = nextProps.source
    const src = newSource.match(/watch\?v=(.*)/)
    if (newSource !== this.player.src() && src) {
      socket.emit('setSource',
        {
          src: 'https://www.youtube.com/' + src[0],
          type: 'video/youtube'
        })
    }
  }

  // destroy player on unmount
  componentWillUnmount () {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render () {
    return (
      <div>
        <div data-vjs-player>
          <video ref={node => (this.videoNode = node)} className='video-js' />
        </div>
      </div>
    )
  }
}

export default Player
