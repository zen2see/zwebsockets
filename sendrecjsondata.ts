import * as readline from 'readline';

// 1. Connect to your local server
const wsocket = new WebSocket('ws://localhost:8081')

// 2. Define the message structure to match the serve
interface SocketMessage {
    type: string;
    content?: any;
    sender?: string;
    target?: string;
    isTyping?: boolean;
}


// 3. Command Handler
// To Broadcast: sendMessage("Hello!") or sendMessage("/all Hi!")
// To Private:  sendMessage("/msg User-123 Secret")
function sendMessage(input: string) {
    // 1. Check for Private Message: /msg [username] [message]
    if (input.startsWith('/msg ')) {
        const parts = input.split(' ');
        // parts[0] is "/msg"
        // parts[1] is the username (e.g., "User-123")
        // parts[2...] is the message
        const targetUser = parts[1]; 
        const messageContent = parts.slice(2).join(' ');
        if (!targetUser || !messageContent) {
            console.error('Usage: /msg [username] [message]');
            return;
        }
         wsocket.send(JSON.stringify({
            type: 'private',
            target: targetUser,
            content: messageContent
        }));
    } else {
        wsocket.send(JSON.stringify({
            type: 'chat',
            content: input
        }));
    }
}
    
// 4. TYPING STATUS
let typingTimer: any;
function handleTyping() {
    wsocket.send(JSON.stringify({ type: 'typing', isTyping: true }));
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        wsocket.send(JSON.stringify({ type: 'typing', isTyping: false }));
    }, 2000);
}
// 5. Receiving logic (Inbund Messages)
wsocket.addEventListener('message', (event: MessageEvent) => {
    try {
        const data: SocketMessage = JSON.parse(event.data);

        switch (data.type) {
            case 'userList':
                console.log('%c ONLINE: ' + data.content.join(', '), 'color: green; font-weight: bold');
                break;
            case 'chat':
                console.log(`[GLOBAL] ${data.sender}: ${data.content}`);
                break;
            case 'private':
                console.log(`%c[PRIVATE] ${data.sender}: ${data.content}`, 'color: magenta; font-weight: bold');
                break;
            case 'typing':
                if (data.isTyping) console.log(`%c... ${data.sender} is typing`, 'color: gray; font-style: italic');
                break;
            case 'error':
                console.error('SERVER ERROR:', data.content);
                break;
        }
    } catch (e) {
        console.log('Raw message:', event.data);
    }
});
wsocket.addEventListener('open', () => {
    console.log('Connected! Type a message and hit Enter.');
    console.log('Commands: /msg [User-ID] [text] or just type to broadcast.');
});

// 6. FIX: Terminal Input (Readline)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false 
});

rl.on('line', (line) => {
    const trimmed = line.trim();
    if (trimmed) {
        sendMessage(trimmed);
    }
});

// Trigger typing status on any keypress
process.stdin.on('keypress', () => {
    handleTyping();
});
// To set up your project properly, you can generate a default tsconfig.json
// automatically or create one manually with the settings optimized for
// modern Node.js and WebSockets. 
// 1. The Automatic Way
// If you have the TypeScript package installed, run this in your terminal: 
// npx tsc --init
// This generates a file with every possible option commented 
// out so you can see what's available. 

// 2. The Recommended "Manual" Config
// Since you are working with WebSockets and running directly in Node,
// create a file named tsconfig.json in your root directory and paste
//  this configuration: 
// tsonfig. json
// {
//   "compilerOptions": {
//     "target": "ESNext",
//     "module": "NodeNext",
//     "moduleResolution": "NodeNext",
//     "outDir": "./dist",
//     "rootDir": "./",
//     "strict": true,
//     "esModuleInterop": true,
//     "skipLibCheck": true,
//     "forceConsistentCasingInFileNames": true,
//     "lib": ["ESNext", "DOM"]
//   },
//   "include": ["**/*.ts"],
//   "exclude": ["node_modules"]
// }

// Why these settings?
// Target/Module (ESNext/NodeNext): Tells TypeScript you are using modern 
// JavaScript features and the newest Node.js module system.
// Strict: Enables all strict type-checking options, which is the best 
// practice for catching bugs early.lib (DOM): Required so TypeScript 
// understands what the WebSocket and MessageEvent types are, as these 
// usually come from the browser's environment.
// outDir: Specifies where your compiled .js files will go if 
// you ever decide to build the project for production. 
// www.typescriptlang.org

// Pro-Tip: Running and Watching
// To make your workflow smoother, you can run the compiler in 
// watch mode using the tsc CLI: 
// npx tsc --watch
// This will automatically re-check your code for errors every time you save.

// Using the CLI. Running tsc locally will compile the closest project 
// defined by a tsconfig. json , or you can compile a set of Type...












