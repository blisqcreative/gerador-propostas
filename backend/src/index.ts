import "reflect-metadata";
import {createConnection} from "typeorm";
import express from "express";
import bcrypt from "bcrypt";
import {User} from "./entity/User";
import {Client} from "./entity/Client"
import {Department} from "./entity/Department"
import {Lead} from "./entity/Lead";


const cors = require("cors");
require('dotenv').config();
const axios = require('axios').default;
var session = require('express-session')
let deal = require('./routes/deal');
let lead = require('./routes/lead');
let product = require('./routes/product');

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
    app.use('/product', product);


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

    /*
    app.get("/products/department/:id", async (req, res) => {
        const {id} = req.params;
        const products = await Product.getProductsInDealByDepartment(parseInt(id));
        if (!products) {
            return res.status(404).send("Products not found");
        }
        console.log(products);


        const productsFormatted = products.map((product, index) => ({

            id: product.productid,
            name: product.productname,
            hours: product.is_selected ? product.product_hours : 0,
            description: product.final_description,
            checked: product.is_selected
        }));
        res.json(productsFormatted);
    });
     */


    app.get("/hello", async (req, res) => {
        res.send("Hello World");

    });

    app.listen(4000, () => console.log('server running on port 4000'))

})()
