import { describe, expect, test } from 'bun:test';

const BACKEND_URL1 = "ws://localhost:8081";
const BACKEND_URL2 = "ws://localhost:8080";

describe("Chat Application", () => {
    test("Message sent from room1 should be received by all participants in room1", async () => {
        const ws1 = new WebSocket(BACKEND_URL1);
        const ws2 = new WebSocket(BACKEND_URL2);

        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                console.log(`ws1: ${BACKEND_URL1}`);
                count++;
                if (count === 2) {
                    resolve()
                }
            }
            ws2.onopen = () => {
                console.log(`ws2: ${BACKEND_URL2}`);
                count++;
                if (count === 2) {
                    resolve()
                }
            }
        })

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "room1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "room1"
        }))

        console.log("Both clients joined room1");

        await new Promise<void>((resolve, reject) => {
            ws2.onmessage = ({ data }) => {
                console.log("ws2 received message:", data);
                const parsedMessage = JSON.parse(data);
                expect(parsedMessage.type === "chat")
                expect(parsedMessage.message === "Hello, world!")
                resolve()
            }
            console.log("ws2 is ready to receive messages");

            ws1.send(JSON.stringify({
                type: "chat",
                room: "room1",
                message: "Hello, world!"
            }))
        })

    })
})