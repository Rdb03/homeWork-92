import mongoose from "mongoose";
import config from "./config";
import crypto from "crypto";
import User from "./models/User";
import Message from "./models/Message";

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
    try {
        await db.dropCollection(collectionName);
    } catch (e) {
        console.log(`Collection ${collectionName} was missing, skipping drop...`);
    }
};

const run = async () => {
    await mongoose.connect(config.mongoose.db);
    const db = mongoose.connection;

    const collections = ['users', 'messages'];

    for (const collectionName of collections) {
        await dropCollection(db, collectionName);
    }

    const [moderator, user] = await User.create(
        {
            username: 'Moderator',
            password: '123456',
            token: crypto.randomUUID(),
            displayName: 'Moderator',
            role: 'moderator',
            active: false,
        }, {
            username: 'User',
            password: '123456',
            token: crypto.randomUUID(),
            displayName: 'User',
            role: 'user',
            active: false,
        }
    );

   await Message.create(
       {
           author: moderator._id,
           text: 'Hello',
           date: new Date(),
       }, {
           author: user._id,
           text: 'Hello moderator',
           date: new Date(),
       }
    );

    await db.close();
};

void run();