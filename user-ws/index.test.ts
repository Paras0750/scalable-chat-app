import { describe, expect, test } from 'bun:test';

const BACKEND_URL = "ws://localhost:8080";

describe("Chat Application", () => {
    test("Message sent from room1 should be received by all participants in room1", async () => {
        const ws1 = new WebSocket(BACKEND_URL);
        const ws2 = new WebSocket(BACKEND_URL);

        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                count++;
                if (count === 2) {
                    resolve()
                }
            }
            ws2.onopen = () => {
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

        await new Promise<void>((resolve, reject) => {
            ws2.onmessage = ({ data }) => {
                const parsedMessage = JSON.parse(data);
                expect(parsedMessage.type === "chat")
                expect(parsedMessage.message === "Hello, world!")
                resolve()
            }

            ws1.send(JSON.stringify({
                type: "chat",
                room: "room1",
                message: "Hello, world!"
            }))
        })

    })
})