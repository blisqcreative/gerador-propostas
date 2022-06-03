import "reflect-metadata";
import {createConnection} from "typeorm";
import express from "express";
import bcrypt from "bcrypt";
import {User} from "./entity/User";
import {Client} from "./entity/Client"
import {Deal} from "./entity/Deal"
import {Department} from "./entity/Department"
import {Lead} from "./entity/Lead";
import {Product} from "./entity/Product";
import {ProductToDeal} from "./entity/ProductToDeal";
import {DealToDepartment} from "./entity/DealToDepartment"

const cors = require("cors");
require('dotenv').config();
const axios = require('axios').default;
var session = require('express-session')
let deal = require('./routes/deal');
let lead = require('./routes/lead');

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: any };
    }
}


(async () => {
    const app = express();
    app.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}}))
    app.use(express.json());
    app.use(cors({origin: 'http://localhost:3000', credentials: true,}));
    app.use(function (req, res, next) {
        res.setHeader('Acess-Control-Allow-Credentials', 'true');
        next();
    })
    app.use('/lead', lead);
    app.use('/deal', deal);



    await createConnection()

    app.post("/user", async (req, res) => {
        const {firstName, lastName, email, password, department} = req.body;

        const newDepartment = await Department.findOne({where: {id: department}});

        const userExists = await User.findOne({where: {email}});

        if (userExists) {
            return res.status(400).send("User already exists");
        }


        let new_password = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: new_password,
            department: newDepartment
        }).save();

        res.status(201).send("User created with id: " + user.id);


    });
    app.post("/login", async (req, res) => {

        const {email, password} = req.body;
        const user = await User.getUserWithDepartmentByEmail(email);

        if (!user) {
            return res.status(404).send("User not found");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).send("Invalid password");
        }

        req.session.user = {
            id: user.id,
            department: user.department.id
        }

        res.json(req.session.user);
    });


    app.post("/client", async (req, res) => {
        const {name, person, email, phone, address, city, state, zip, nif, idCRM} = req.body;

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
    app.get("/client/:idCRM", async (req, res) => {
        const {idCRM} = req.params;
        const client = await Client.findOne({where: {idCRM}});
        if (!client) {
            return res.status(404).send("Client not found");
        }
        res.json(client);
    });

    app.get("/lastLeadId", async (req, res) => {
        const lead = await Lead.findOne({
            order: {
                id: "DESC"
            }
        });
        if (!lead) {
            return res.status(404).send("Lead not found");
        }
        res.json(lead.id);
    });

    app.get("/departments", async (req, res) => {
        const departments = await Department.find();
        res.json(departments);
    });



    app.post("/updatedLead", async (req, res) => {
        console.log("Nova lead atualizada");
        console.log(req.body);
        res.send("recebi webhook");

        const lead = await Lead.findOne({where: {crmId: req.body.id}});
        if (!lead) {
            return res.status(404).send("Lead not found");
        }
        if (req.body.client) {
            let client = await Client.findOne({where: {idCRM: req.body.company.id}});
            let body = req.body;
            const idCompany = body.company ? body.company.id : null;
            let newClient;
            if (!client) {
                newClient = await axios.get(`https://blisq.teamwork.com/crm/api/v2/companies/${idCompany}.json`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + process.env.TOKEN_TW
                    },
                });
                if (newClient.status === 200) {

                    client = await Client.create({
                        name: newClient.data.company.name,
                        person: "",
                        email: newClient.data.company.emailAddresses[0].address ? newClient.data.company.emailAddresses[0].address : "Sem email associado",
                        phone: "",
                        address: newClient.data.company.addressLine1 ? newClient.data.company.addressLine1 : "Sem morada",
                        city: newClient.data.company.city ? newClient.data.company.city : "Sem cidade",
                        state: newClient.data.company.stateOrCounty ? newClient.data.company.stateOrCounty : "Sem distrito",
                        zip: newClient.data.company.zipcode ? newClient.data.company.zipcode : "Sem código postal",
                        nif: 111111111,
                        idCRM: newClient.data.company.id
                    }).save();
                }

            }
            console.log(client);
            lead.client = client;
            let newLead = await lead.save();
            console.log("Lead updated with id: " + newLead.id);
            return res.status(200).send("Lead updated");
        }
    });

    app.post("/testWebhook", async (req, res) => {

    });

    app.get("/products/department/:id", async (req, res) => {
        const {id} = req.params;
        const products = await Product.getProductsInDealByDepartment(parseInt(id));
        if (!products) {
            return res.status(404).send("Products not found");
        }
        console.log(products);


        const productsFormatted = products.map((product, index) => ({

            id: product.id,
            name: product.productname,
            hours: product.is_selected ? product.product_hours : 0,
            description: product.final_description,
            checked: product.is_selected
        }));
        res.json(productsFormatted);
    });


    app.get("/hello", async (req, res) => {
        res.send("Hello World");

    });

    app.listen(4000, () => console.log('server running on port 4000'))

})()
