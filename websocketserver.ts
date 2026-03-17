// SETUP SERVER
// REMEMBER TO pnpm init pnpm install ws
/**
 * If you are on an older version of Node (like v20 or v22) 
 * or need full TypeScript feature support, tsx is the 
 * current industry favorite because it is significantly 
 * faster than ts-node. 
 * Run without installing: bash
 * npx tsx websocketserver.ts
 * nstall for regular use:
 * Npm install -g tsx
 * tsx websocketserver.ts/watch mode tsx watch websocketserver.ts
 * The ts-node Way (Legacy)
 * node --loader ts-node/esm websocketserver.ts
 * 
 */

// The "Upgrade Required" message appears because you are trying 
// to visit a WebSocket server (which uses the ws:// protocol) 
// by typing its address directly into a web browser's address bar
//  (which uses the http:// protocol). 

// Why this happens
// Protocol Mismatch: Your browser is sending a standard HTTP request 
// to a server that only understands WebSockets.
// The Handshake: For a WebSocket connection to work, 
// the client must send a special header asking the server to "upgrade"
// from HTTP to WebSockets. When you just type the URL in a browser,
// this header is missing, so the server responds with an HTTP 426 
// Upgrade Required error. 

// How to fix it
// You cannot "visit" a raw WebSocket server like a website. 
// To interact with it, you need a WebSocket client. You can test
// your server in two ways: 
// Use a Browser Extension or Online Tool:
// Install a Chrome/Firefox extension like Simple WebSocket Client.
// Use an online tester like PieSocket or Websocket King.
// Enter your address: ws://localhost:8081.
// Use a Simple JavaScript Client:
// Create a basic HTML file (e.g., test.html) on your computer and 
// open it in your browser. It will connect to your server through 
// the background console.
// html
// <script>
//   const socket = new WebSocket('ws://localhost:8081');
//   socket.onopen = () => console.log('Connected to server!');
//   socket.onmessage = (event) => console.log('Message from server:', 
//   event.data);
// </script>

// Use the Browser Console:
// Open any website (like google.com).
// Press F12 to open Developer Tools and click the Console tab.
// Paste this code and press Enter: 
// javascript
// const ws = new WebSocket('ws://localhost:8081');
// ws.onopen = () => console.log('Connected!');

import { WebSocketServer, WebSocket } from 'ws'

// Extend the WebSocket type to include a username property
interface CustomWebSocket extends WebSocket {
    username?: string;
}

// Define the interface for consistent data structure
interface SocketMessage {
    type: string;
    content: string;
    sender?: string; // Added to identify who sent what
}

const wss = new WebSocketServer({ port: 8081 })
console.log('Server running on ws://localhost:8081')

wss.on('connection', (ws: CustomWebSocket) => {
    // Assign a random username (e.g., User-482)
    ws.username = `User-${Math.floor(Math.random() * 1000)}`
    console.log(`${ws.username} joined the chat.`)

    ws.on('message', (data: string) => {
        try {
            // Parse incoming JSON from client
            const parsed = JSON.parse(data.toString())
             
            // Build the broadcast message with the assigned username
            const broadcastData: SocketMessage = {
                type: 'BroadcastChat',
                content: parsed.content,
                sender: ws.username,  
            };

            const payload = JSON.stringify(broadcastData);

            // BROADCASTING LOGIC:
            // Iterate over all connected clients
            wss.clients.forEach((client: CustomWebSocket) => {
                // Only send if the connection is still open
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload)
                }
            })

        } catch (error) {
            console.error(`Invalid JSON from ${ws.username}:`, data.toString())
        }
    });

    ws.on('close', () => console.log(`${ws.username} left.`))
});


// wsocket.addEventListener('message', (event: MessageEvent) => {
//     try {
//         const data: SocketMessage = JSON.parse(event.data);
//         // Display as: [User-123]: Hello!
//         console.log(`[${data.sender}]: ${data.content}`);
//     } catch (e) {
//         console.log('Raw message:', event.data);
//     }
// }

console.log('Broadcast Server running on ws://localhost:8081');
// wss.on('connection', (ws) => {
//     console.log('Client cConnected')
//     ws.send('Welcome!')
//     ws.on('message', (msg: { toString: () => any }) => {
//         console.log('Received:', msg.toString())
//         ws.send(`Echo: $(msg.toString()})`)
//     })
//     ws.on('close', () => console.log('Client Disconnected'))
// })