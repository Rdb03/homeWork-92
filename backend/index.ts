import express from 'express';
import expressWs from "express-ws";
import cors from 'cors';
import {ActiveConnections, IncomingMessage} from "./types";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {};

router.ws('/chat', (ws, _req, _next) => {
    const id = crypto.randomUUID();
    console.log('Client connected', id);
    activeConnections[id] = ws;
    let username = 'Anonymous';

    ws.send(JSON.stringify({type: 'WELCOME', payload: 'Hello, you have connected to the chat!'}));

    ws.on('message', (message) => {
       console.log(message.toString());
       const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
        if(parsedMessage.type === 'SET_USERNAME') {
            username = parsedMessage.payload;
        } else if (parsedMessage.type === 'SEND_MESSAGE') {
            Object.values(activeConnections).forEach(connection => {
                const outgoingMsg = {type: 'NEW_MESSAGE', payload: {
                        username,
                        message: parsedMessage.payload
                    }};
                connection.send(JSON.stringify(outgoingMsg));
            });
        }
    });

    ws.on('close', () => {
       console.log('Client disconnected', id);
       delete activeConnections[id];
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
})