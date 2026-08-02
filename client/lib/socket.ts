import { io } from "socket.io-client";

export const socket = io("ws://localhost:3001", {
    reconnectionDelayMax: 10000,
    path: "/ws/live",
    transports: ['websocket']

});

