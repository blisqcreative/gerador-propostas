import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "./routes/Home"
import Login from "./routes/Login"
import NewDeal from "./routes/NewDeal"
import {NewClient} from "./routes/NewClient"
import NewBriefing from "./routes/NewBriefing"
import ListDeals from "./routes/ListDeals"
import AddTaskToDeal from "./routes/AddTaskToDeal"

const rootElement = document.getElementById("root");
ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/newDeal" element={<NewBriefing />} />
            <Route path="/deals" element={<ListDeals />} />
            <Route path="/deals/:id" element={<AddTaskToDeal />} />
            <Route path="/NewClient" element={<NewClient />} />
        </Routes>
    </BrowserRouter>,
    rootElement
);
