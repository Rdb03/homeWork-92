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
    active: boolean;
}

export interface UserFields {
    _id: string;
    username: string,
    password: string,
    token: string,
    role: string,
    displayName: string;
    active: boolean;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;
