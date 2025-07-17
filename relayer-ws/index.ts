
import type { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 3001 });
console.log(`WebSocket server is running on ws://localhost:3001`);

const servers: WebSocket[] = []

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    servers.push(ws)

    ws.on('message', (data: string) => {
        servers.map(socket =>
            socket.send(data)
        )
    })
});


wss.on('close', (ws: WebSocket) => {
    const index = servers.indexOf(ws);
    if (index !== -1) {
        servers.splice(index, 1);
    }
});