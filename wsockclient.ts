// NATIVE WEBSOCKET CLIENT
const socket = new WebSocket('ws://localhost:8081')
socket.addEventListener('open', () => {
    console.log('connected to server'), 
    socket.send(JSON.stringify({type: 'greet', message: 'Hello Server!'}))
})
socket.addEventListener('message', (event) => {
    console.log('Received', event.data)
})
socket.addEventListener('close', (event) => {
    console.log('Connection closed:', event.code, event.reason)})

socket.addEventListener('error', (err) => {
    console.error('WebSocket error:', err)
})