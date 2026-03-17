// 1. Connect to your local server
const wsocket = new WebSocket('ws://localhost:8081')

// 2. Define the message structure to match the serve
interface SocketMessage {
    type: string;
    content: string;
    sender?: string; // Optional - we don't know until server sends it
}

// 3. When the connection opens, send a test message
wsocket.addEventListener('open', () => {
     console.log('%c Connected to Broadcast Server ', 
        'background: #222; color: #bada55')
    const initialData: SocketMessage = { 
        type: 'BroadcastChat', 
        content: 'Hello everyone! I just joined.'

    };

    // Always stringify before sending
    wsocket.send(JSON.stringify(initialData));
});

// 4. Listen for incoming broadcasts from the server
wsocket.addEventListener('message', (event: MessageEvent) => {
    try {
        // Parse the JSON string sent by the server
        const data: SocketMessage = JSON.parse(event.data);

        // Display the message with the sender's name
        // Example output: [User-432]: Hello everyone!
        console.log(`%c[${data.sender}]: %c${data.content}`, 'font-weight: bold; color: blue', 'color: black');
        
    } catch (error) {
        // Fallback for non-JSON messages (like a "Welcome" string)
        console.log('Raw message received:', event.data);
    }
});


// 5. Good practice: Add an error listener to catch connection issues
wsocket.addEventListener('error', (event) => {
    console.error('WebSocket error observed:', event);
});

// 6. Close
wsocket.addEventListener('close', () => {
    console.log('Disconnected from server.');
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












