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
        const {firstName, lastName, email, password, department} = req.body;

        const newDepartment = await Department.findOne({where: {id: department}});

        const userExists = await User.findOne({where: {email}});

        if (userExists) {
            return res.status(400).send("User already exists");
        }


        let new_password = await bcrypt.hash(password, 10);

        const user = await User.create({firstName, lastName, email, password: new_password, department: newDepartment}).save();

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
    app.get("/deal", async (req, res) => {
        const deals = await Deal.getDealWithDepartments();
        res.json(deals);
    });
    app.get("/deal/:id", async (req, res) => {
        const {id} = req.params;
        const deal = await Deal.getDealWithDepartmentById(parseInt(id));
        console.log(deal);
        if (!deal) {
            return res.status(404).send("Deal not found");
        }
        res.json(deal);
    });

    app.post("/deal", async (req, res) => {
        const {clientId, departmentsId, clientStatus, inner_id, status, work, timings} = req.body;
        const date = new Date();

        const client = await Client.findOne({where: {nif: clientId}});
        if (!client) {
            return res.status(400).send("Client not found");
        }
        const user = await User.findOne();
        const departments = [];

        for (const departmentId of departmentsId) {
            const department = await Department.findOne({where: {id: departmentId}});
            if (!department) {
                res.status(400).send("Department not found")
            }
            departments.push(department);
        }

        const deal = await Deal.create({client, user, date, clientStatus, status, inner_id, work, timings, departments}).save();


        if(deal){
            res.status(201).send("Deal created with id: " + deal.id);
        }else{
            res.status(400).send("Error creating deal");
        }
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

    app.post("/testWebhook", async (req, res) => {
        const body = req.body;
        console.log(body);
    });


    app.listen(3000, () => console.log('server running on port 3000'))

})()