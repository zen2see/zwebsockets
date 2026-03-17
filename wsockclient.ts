// NATIVE WEBSOCKET CLIENT
/**
 * WebSockets enable persistent, full-duplex communication between a client 
 * and a server over a single TCP connection. Unlike HTTP’s request-response
 *  model, WebSockets allow real-time, bidirectional data exchange with 
 * minimal overhead, making them ideal for chat apps, live dashboards, 
 * multiplayer games, and IoT systems. From Node.js v21+, a native WebSocket
 *  client is available via the WebSocket constructor, removing the need for 
 * external client libraries like ws for outbound connections. However, 
 * Node.js still lacks a built-in WebSocket server, so libraries like ws or 
 * Socket.IO are required for hosting WebSocket endpoints.
 * Example: Native WebSocket Client (Node.js v22+)
 * Since Node.js v21, the WebSocket API has been enhanced using the Undici 
 * library, introducing a built-in WebSocket client. This simplifies 
 * real-time communication for Node.js applications. In Node.js v22.4.0 release,
 *  the WebSocket API was marked as stable, indicating it's ready for production use.
 */

// Creates a new WebSocket connection to the specified URL.
const socket = new WebSocket('ws://localhost:8081')
// Executes when the connection is successfully established.
socket.addEventListener('open', () => {
    console.log('connected to server'), 
    // Sends a message to the WebSocket server.
    socket.send(JSON.stringify({type: 'greet', message: 'Hello Server!'}))
})
// Listen for messages and executes when a message is received from the server.
socket.addEventListener('message', (event) => {
    console.log('Received', event.data)
})
socket.addEventListener('close', (event) => {
    console.log('Connection closed:', event.code, event.reason)})

socket.addEventListener('error', (err) => {
    console.error('WebSocket error:', err)
})