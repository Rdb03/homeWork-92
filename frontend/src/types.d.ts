export interface RegisterMutation {
    username: string,
    password: string,
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string,
            message: string,
        }
    },
    message: string,
    name: string,
    _message: string,
}

export interface RegisterResponse {
    message: string,
    user: IUser,
}

export interface LoginMutation {
    username: string,
    password: string,
}

export class GlobalError {
    error: string
}

export interface IUser {
    _id: string;
    username: string;
    password: string;
    token: string;
    role: string;
    displayName: string;
    active: boolean;
}

export interface ILoginSuccess {
    type: string;
    payload: {
        current?: IUser | IMessage;
        users?: IUser[];
        messages?: IMessage[]
    }
}

export interface IMessage {
    _id: string;
    text: string;
    date: string;
    author: {
        _id: string;
        username: string;
    }
}
