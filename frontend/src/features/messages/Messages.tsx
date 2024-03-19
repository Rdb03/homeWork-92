import React, {useEffect, useRef, useState} from 'react';
import OnlineUsers from "./components/OnlineUsers";
import {selectUser} from "../users/usersSlice";
import {useAppSelector} from "../../app/hook";
import {useNavigate} from "react-router-dom";
import {ILoginSuccess, IMessage, IUser} from "../../types";
import {Button, Grid, Typography} from "@mui/material";
import TelegramIcon from '@mui/icons-material/Telegram';

const Messages = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const ws = useRef<WebSocket | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (!user) {
        if (ws.current) {
            ws.current.close();
        }
      navigate('/login');
    }

    ws.current = new WebSocket('ws://localhost:8000/chat');

    if (!ws.current) return;

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: 'LOGIN',
        payload: user?.token
      }));
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as ILoginSuccess;

      switch (decodedMessage.type) {
        case 'LOGIN_SUCCESS':
            const activeUser = decodedMessage.payload.users as IUser[];
            const messages = decodedMessage.payload.messages as IMessage[];
            setUsers(activeUser);
            setMessages(messages);
          break;
          case 'NEW_USER':
              setUsers((prevState) => {
                  const currentUser = decodedMessage.payload.current as IUser;
                  const existingUser = prevState.find(user => user._id === currentUser._id);

                  if (!existingUser) {
                      return [...prevState, currentUser];
                  }

                  return prevState;
              });
              break;
          case 'USER_LOGOUT':
              const activeUsers = decodedMessage.payload.users as IUser[];
              setUsers(activeUsers);
              break;
          case 'NEW_MESSAGE':
          setMessages((prevState) => {
            const currentMessage = decodedMessage.payload.current as IMessage;
            return [...prevState, currentMessage];
          });
          break;
        default:
          console.log('Unknown message type:', decodedMessage.type);
      }
    }
  }, [user, navigate]);

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;

    ws.current.send(JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: messageText
    }));

    setMessageText("");
  };

    console.log(messages)

  return (
      <>
        <Grid sx={{display: 'flex', border: '3px solid black'}}>
          <OnlineUsers users={users}/>
          <Grid sx={{width: '80%', height: '500px', textAlign: 'start', overflowY: 'scroll'}}>
            <Grid sx={{borderBottom: '3px solid black', textAlign: 'center'}}>
              <Typography variant="h4">Messages</Typography>
            </Grid>
            {messages.map((item) => (
                <Typography sx={{paddingLeft: '20px'}} key={item._id}>{item.author.username}: {item.text}</Typography>
            ))}
          </Grid>
        </Grid>
        <form style={{marginTop: 'auto'}} onSubmit={sendMessage}>
          <input
              type="text"
              name="messageText"
              value={messageText}
              onChange={changeMessage}
              placeholder="Enter message"
              required
              style={{
                width: '600px',
                height: '50px',
                marginTop: '20px',
                padding: '5px',
                boxSizing: 'border-box'
              }}
          />
          <Button type="submit" variant="contained" sx={{marginLeft: '30px'}}>Send <TelegramIcon sx={{marginLeft: '10px'}}/></Button>
        </form>
      </>
  );
};

export default Messages;