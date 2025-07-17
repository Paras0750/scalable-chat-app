import { WebSocketServer, WebSocket as WebSocketType } from 'ws';

const PORT = 8080;
console.log(`WebSocket server is running on ws://localhost:${PORT}`);
const wss = new WebSocketServer({ port: PORT });

interface Room {
    sockets: WebSocketType[];
}

const RELAYER_URL = 'ws://localhost:3001';
const relayerSocket = new WebSocket(RELAYER_URL);

relayerSocket.onmessage = ({ data }) => {
    const parsedMessage = JSON.parse(data)

    if (parsedMessage.type === 'chat') {
        if (rooms[parsedMessage.room]) {
            rooms[parsedMessage.room]!.sockets.forEach((socket: WebSocketType) => {
                socket.send(JSON.stringify(parsedMessage))
            })
        }
    }
}
const rooms: Record<string, Room> = {}

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (data: string) => {
        const parsedMessage = JSON.parse(data)

        if (!parsedMessage.room) return
        if (parsedMessage.type === 'join-room') {
            if (!rooms[parsedMessage.room]) {
                rooms[parsedMessage.room] = {
                    sockets: []
                }
            }
            rooms[parsedMessage.room]!.sockets.push(ws)

        }
        if (parsedMessage.type === 'chat') {
            console.log("Received message from client:", data);
            relayerSocket.send(data)
        }
    })
});