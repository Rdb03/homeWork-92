import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {ChatMessage, IncomingMessage} from "./types";

const App = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageText, setMessageText] = useState('');
    const [usernameText, setUsernameText] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameText(e.target.value);
    };

    const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
    };

    const ws = useRef<WebSocket | null>(null);



    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current?.addEventListener('close', () => console.log('ws closed'));

        ws.current.addEventListener('message', (event) => {
            const decodedMessages = JSON.parse(event.data) as IncomingMessage;

            if (decodedMessages.type === 'NEW_MESSAGE') {
                setMessages(prev => [...prev, decodedMessages.payload]);
            }

            if(decodedMessages.type === 'WELCOME') {
                console.log(decodedMessages.payload);
            }

        });

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        }

    }, []);

    const setUserName = (e: React.FormEvent) => {
        e.preventDefault();

        if(!ws.current) return;

        ws.current.send(JSON.stringify({
            type: 'SET_USERNAME',
            payload: usernameText
        }));

        setIsLoggedIn(true);
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if(!ws.current) return;

        ws.current.send(JSON.stringify({
            type: 'SEND_MESSAGE',
            payload: messageText,
        }));
    }

    let chat = (
        <div>
            {messages.map((message, idx) => (
                <div key={idx}>
                    <b>{message.username}:</b> {message.message}
                </div>
            ))}
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    name="messageText"
                    value={messageText}
                    onChange={changeMessage}
                />
                <input type="submit" value="Send"/>
            </form>
        </div>
    )

    if(!isLoggedIn) {
        chat = (
            <form onSubmit={setUserName}>
                <input
                    value={usernameText}
                    onChange={changeUsername}
                />
                <input type="submit" value="Enter chat"/>
            </form>
        );
    }

    return chat;
};

export default App;