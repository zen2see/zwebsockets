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
    type: 'chat' | 'private' | 'userList' | 'typing' | 'error';
    content?: any;
    sender?: string;
    target?: string;
    isTyping?: boolean;
}

const wss = new WebSocketServer({ port: 8081 })
console.log('Server running on ws://localhost:8081')

// Helper to send the current list of online users to everyone
const broadcastUserList = () => {
    const users: string[] = [];
    wss.clients.forEach((client: CustomWebSocket) => {
        if (client.username) users.push(client.username);
    });

    const payload = JSON.stringify({ type: 'userList', content: users });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
};

wss.on('connection', (ws: CustomWebSocket) => {
    // Assign a random username (e.g., User-482)
    ws.username = `User-${Math.floor(Math.random() * 1000)}`
    console.log(`${ws.username} joined the chat.`)
     // Send the updated list now that someone new joined
    broadcastUserList();

    ws.on('message', (data: string) => {
        try {
            // Parse incoming JSON from client
            const parsed: SocketMessage = JSON.parse(data.toString())
            
             // 2. Handle Typing Indicators
            if (parsed.type === 'typing') {
                const payload = JSON.stringify({ 
                    type: 'typing', 
                    sender: ws.username, 
                    isTyping: parsed.isTyping 
                });
                wss.clients.forEach((client: CustomWebSocket) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) client.send(payload);
                });
            }

            // 3. Handle Private Messages
            else if (parsed.type === 'private' && parsed.target) {
                let found = false;
                const payload = JSON.stringify({ 
                    type: 'private', 
                    sender: ws.username, 
                    content: parsed.content 
                });
             
                 wss.clients.forEach((client: CustomWebSocket) => {
                    if (client.username === parsed.target) {
                        client.send(payload);
                        found = true;
                    }
                });
                
                ws.send(payload); // Echo back to sender
                if (!found) ws.send(JSON.stringify({ type: 'error', content: `User ${parsed.target} not found.` }));
            }

            // 4. Handle Global Broadcast
            else if (parsed.type === 'chat') {
                const payload = JSON.stringify({ 
                    type: 'chat', 
                    sender: ws.username, 
                    content: parsed.content 
                });
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) client.send(payload);
                });
            }
        } catch (e) {
            console.error('Invalid JSON received');
        }
    });

    ws.on('close', () => {
        console.log(`${ws.username} disconnected.`);
        broadcastUserList();
    });
});

console.log('Chat Server running on ws://localhost:8081');
