import {Model} from "mongoose";
import {WebSocket} from "ws";

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

export interface IUser {
    _id: string;
    username: string;
    password: string;
    token: string;
    role: string;
}

export interface UserFields {
    username: string,
    password: string,
    token: string,
    role: string,
    displayName: string;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;
