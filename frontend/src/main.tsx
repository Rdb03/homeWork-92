import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {PersistGate} from "redux-persist/integration/react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import theme from "./theme.ts";
import {ThemeProvider} from "@mui/material";
import {persist, store} from "./app/store.ts";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate persistor={persist}>
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <App/>
                    </ThemeProvider>
                </BrowserRouter>
        </PersistGate>
    </Provider>
)