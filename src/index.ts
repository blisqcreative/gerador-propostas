import "reflect-metadata";
import {createConnection} from "typeorm";

import express from "express";
import bcrypt from "bcrypt";
import {User} from "./entity/User"

;(async () => {
    const app = express();
    app.use(express.json());

    await createConnection()

    app.post("/user", async (req, res) => {
        const {firstName, lastName, email, password} = req.body;

        const userExists = await User.findOne({where: {email}});

        if (userExists) {
            return res.status(400).send("User already exists");
        }

        
        let new_password = await bcrypt.hash(password, 10);

        const user = await User.create({firstName, lastName, email, password: new_password}).save();

        res.status(201).send("User created with id: " + user.id);


    });
    app.listen(3000, () => console.log('server running on port 3000'))
})()