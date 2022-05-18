import "reflect-metadata";
import {createConnection} from "typeorm";

const cors = require("cors");
import express from "express";
import bcrypt from "bcrypt";
import {User} from "./entity/User";
import {Task} from "./entity/Task";
import {Service} from "./entity/Service"
import {Client} from "./entity/Client"
import {Deal} from "./entity/Deal"
import {TaskToDeal} from "./entity/TaskToDeal"
import {Department} from "./entity/Department"


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
            return res.status(404).send("User not found");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).send("Invalid password");
        }

        res.status(200).send("Logged in");
    });

    app.get("/tasks", async (req, res) => {
        const tasks = await Task.find();
        res.json(tasks);
    });

    app.post("/task", async (req, res) => {
        const {title, description, serviceId} = req.body;


        const service = await Service.findOne({where: {id: serviceId}});
        if (!service) {
            return res.status(400).send("Service not found");
        }
        const task = await Task.create({title, description, service}).save();
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


    app.post("/client", async (req, res) => {
        const {name, person, email, phone, address, city, state, zip, nif} = req.body;

        const clientExists = await Client.findOne({where: {nif}});
        if (clientExists) {
            return res.status(400).send("Client already exists");
        }

        const client = await Client.create({name, person, email, phone, address, city, state, zip, nif}).save();
        res.status(201).send("Client created with id: " + client.id);
    });
    app.get("/client", async (req, res) => {
        const clients = await Client.find();
        res.json(clients);
    });
    app.get("/client/:nif", async (req, res) => {
        const {nif} = req.params;
        const client = await Client.findOne({where: {nif}});
        if (!client) {
            return res.status(400).send("Client not found");
        }
        res.json(client);
    });
    app.post("/deal", async (req, res) => {
        const {clientId, tasksId, typeId} = req.body;
        const date = new Date();
        let tasks: Promise<TaskToDeal>[] = [];

        const client = await Client.findOne({where: {id: clientId}});
        if (!client) {
            return res.status(400).send("Client not found");
        }
        const user = await User.findOne();


        const deal = await Deal.create({client, user, date}).save();

        tasksId.forEach(taskId => {
            const taskToDeal = new TaskToDeal();
            taskToDeal.task = taskId;
            taskToDeal.deal = deal;
            taskToDeal.taskId = taskId;
            taskToDeal.hours = 2;
            taskToDeal.sellPrice = 100;
            taskToDeal.costPrice = 50;
            tasks.push(taskToDeal.save());
        });
        await Promise.all(tasks)
        //res.status(201).send("Deal created with id: " + deal.id);
    });
    app.get("/lastDealId", async (req, res) => {
        const deal = await Deal.findOne({
            order: {
                id: "DESC"
            }
        });
        if(!deal) {
            return res.status(404).send("Deal not found");
        }
        res.json(deal.id);
    });

    app.get("/departments", async (req, res) => {
        const departments = await Department.find();
        res.json(departments);
    });


    app.listen(3000, () => console.log('server running on port 3000'))

})()