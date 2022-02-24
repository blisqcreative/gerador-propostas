import "reflect-metadata";
import {createConnection} from "typeorm";

const cors = require("cors");
import express from "express";
import bcrypt from "bcrypt";
import {User} from "./entity/User";
import {Task} from "./entity/Task";
import {Service} from "./entity/Service"




(async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

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
    app.post("/login", async (req, res) => {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            return res.status(400).send("User not found");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send("Invalid password");
        }

        res.status(200).send("Logged in");
    });

    app.get("/tasks", async (req, res) => {
        const tasks = await Task.find();
        res.json(tasks);
    });

    app.post("task", async (req, res) => {
        const {title, description} = req.body;
        const task = await Task.create({title, description}).save();
        res.status(201).send("Task created with id: " + task.id);
    });
    app.get("/services", async (req, res) => {
        const services = await Service.find();
        res.json(services);
    });

    app.post("/service", async (req, res) => {
        const {name} = req.body;
        const service = await Service.create({name}).save();
        res.status(201).send("Service created with id: " + service.id);
    });
    app.listen(3000, () => console.log('server running on port 3000'))

})()