export interface ChatMessage {
    username: string;
    message: string;
}

export interface IncomingChatMessage {
    type: 'NEW_MESSAGE';
    payload: ChatMessage;
}

export interface IncomingWelcomeMessage {
    type: 'WELCOME';
    payload: string;
}

export type IncomingMessage = IncomingChatMessage | IncomingWelcomeMessage;