let isFirstTime = true
let shouldEmitSocket = {
  volume: true,
  play: true,
  pause: true,
  seeked: true
}

export default function (that) {
  that.player.on('play', function () {
    if (shouldEmitSocket.play) {
      that.socket.emit('play')
    } else {
      shouldEmitSocket.play = true
    }
    // console.log('play 555')
    // player.play()
  })

  that.player.on('pause', function () {
    console.log('pause')
    if (shouldEmitSocket.pause) {
      that.socket.emit('pause')
    } else {
      shouldEmitSocket.pause = true
    }
    // player.pause()
  })

  that.player.on('volumechange', function () {
    console.log('volumeChange')
    if (shouldEmitSocket.volume) {
      that.socket.emit('volumeChange', that.player.volume())
    } else {
      shouldEmitSocket.volume = true
    }
  })

  that.player.on('timeupdate', function () {
    let currentTime = that.player.currentTime()
    that.setState({
      previousTime: that.state.currentTime,
      currentTime
    })
    that.socket.emit('timeUpdate', currentTime)
  })

  that.player.on('seeking', function () {
    if (that.state.seekStart === null) {
      that.setState({
        seekStart: that.state.previousTime
      })
    }
  })

  that.player.on('seeked', function () {
    const { seekStart, currentTime, previousTime } = that.state
    console.log('seeked from', seekStart, 'to', currentTime, '; delta:', currentTime - previousTime)
    that.setState({
      seekStart: null
    })
    if (shouldEmitSocket.seeked) {
      that.socket.emit('seek', currentTime)
    } else {
      shouldEmitSocket.seeked = true
    }
    // console.log('seeked')
  })

  // socket event
  that.socket.on('newSource', function (data) {
    that.player.src(data)
    that.player.play()
  })

  that.socket.on('play', (id) => {
    shouldEmitSocket.play = false
    that.player.play()
  })

  that.socket.on('pause', () => {
    shouldEmitSocket.pause = false
    that.player.pause()
  })

  that.socket.on('volumeChange', ({ volume, id }) => {
    // if (that.state.id !== id) {
    shouldEmitSocket.volume = false
    that.player.volume(volume)
    // }
  })

  that.socket.on('seeked', ({cur}) => {
    shouldEmitSocket.seeked = false
    that.player.currentTime(cur)
  })

  that.socket.on('1st time join', ({ room, id }) => {
    shouldEmitSocket.seeked = false
    shouldEmitSocket.volume = false
    shouldEmitSocket.play = false
    console.log(room)
    that.setState({ id })
    that.player.src(room.src)
    that.player.currentTime(room.currentTime)
    that.player.volume(room.volume)
    if (room.isPlay) {
      that.player.play()
    }
  })
}
