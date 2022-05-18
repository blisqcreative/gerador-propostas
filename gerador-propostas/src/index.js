import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "./routes/Home"
import Login from "./routes/Login"
import NewDeal from "./routes/NewDeal"
import {NewClient} from "./routes/NewClient"
import NewBriefing from "./routes/NewBriefing"

const rootElement = document.getElementById("root");
ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/newDeal" element={<NewBriefing />} />
            <Route path="/NewClient" element={<NewClient />} />
        </Routes>
    </BrowserRouter>,
    rootElement
);
