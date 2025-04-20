import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react';
import App from './App.jsx';
import './Assets/Style/index.css';
import {BrowserRouter} from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <HeroUIProvider>
            <App />
        </HeroUIProvider>
    </BrowserRouter>
);