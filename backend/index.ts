import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routers/users";
import crypto from "crypto";
import {ActiveConnections, IncomingMessage, IUser} from "./types";
import expressWs from "express-ws";
import User from "./models/User";
import Message from "./models/Message";

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use('/users', userRouter);

expressWs(app);

const router = express.Router();
const activeConnections: ActiveConnections = {};

router.ws('/chat',  (ws, _req, _next) => {
    const id = crypto.randomUUID();
    activeConnections[id] = ws;
    let user: IUser | null = null;

    ws.on('message', async(msg) => {
        const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;

        switch (decodedMessage.type) {
            case 'LOGIN':
                user = await User.findOne({ token: decodedMessage.payload }, '_id username');
                if (!user) return;

                const users = await User.find({ active: true }, '_id username');

                const messages = await Message
                    .find()
                    .limit(30)
                    .sort({ date: -1 })
                    .populate('author', 'username');

                messages.reverse();

                ws.send(JSON.stringify({
                    type: 'LOGIN_SUCCESS',
                    payload: { users, messages}
                }));

                Object.keys(activeConnections).forEach(key => {
                    const conn = activeConnections[key];

                    if (key !== id) {
                        conn.send(JSON.stringify({
                            type: 'NEW_USER',
                            payload: { current: user }
                        }));
                    }
                });
                break;
            case 'SEND_MESSAGE':
                if (user) {
                    const newMessage = new Message({
                        author: user._id,
                        text: decodedMessage.payload,
                        date: new Date()
                    });

                    await newMessage.save();

                    Object.keys(activeConnections).forEach(key => {
                        const conn = activeConnections[key];

                        conn.send(JSON.stringify({
                            type: 'NEW_MESSAGE',
                            payload: {
                                current: {
                                    _id: newMessage._id,
                                    author: {
                                        _id: user?._id,
                                        username: user?.username
                                    },
                                    text: newMessage.text,
                                    date: newMessage.date
                                }
                            }
                        }));
                    });
                }

                break;
            default:
                console.log('Unknown message type:', decodedMessage.type);
        }
    });

    ws.on('close', async () => {
        const onlineUsers = await User.find({ active: true }, '_id username');
        Object.keys(activeConnections).forEach(key => {
            const conn = activeConnections[key];
            conn.send(JSON.stringify({
                type: 'USER_LOGOUT',
                payload: {users: onlineUsers}
            }));
        });
    });
});

app.use(router);

const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    })
};

void run();