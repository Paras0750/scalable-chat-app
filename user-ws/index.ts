import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface Room {
    sockets: WebSocket[];
}

const rooms: Record<string, Room> = {}

wss.on('connection', function connection(ws) {

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
            if (rooms[parsedMessage.room]) {
                rooms[parsedMessage.room]!.sockets.forEach((socket: WebSocket) => {
                    socket.send(JSON.stringify(parsedMessage))
                })
            }
        }
    })
});