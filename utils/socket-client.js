import io from 'socket.io-client'
const socket = io.connect(process.env.URL)

export default socket
