import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface Room {
    sockets: WebSocket[];
}

const rooms: Record<string, Room> = {}

wss.on('connection', function connection(ws) {
    const roomId = 1
    if (!rooms[roomId]) {
        rooms[roomId] = {
            sockets: [ws]
        }
    }
    rooms[roomId].sockets.push(ws)

    ws.on('error', console.error);

    ws.send('something');
});