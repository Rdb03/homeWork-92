import './App.css';
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import {Container} from "@mui/material";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";
import NoFound from "./components/NoFound/NoFound.tsx";
import Messages from "./features/messages/Messages.tsx";

const App = () => {

    return (
        <>
            <header>
                <Header/>
            </header>
            <main>
                <Container maxWidth="xl" sx={{ marginTop: '50px' }}>
                    <Routes>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="*" element={<NoFound/>}/>
                        <Route path="/" element={<Messages/>}/>
                    </Routes>
                </Container>
            </main>
        </>
    );
};

export default App;
