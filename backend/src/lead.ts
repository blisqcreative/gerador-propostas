import {Lead} from "../entity/Lead"
import {Client} from "../entity/Client"
import {default as axios} from "axios"

let express = require('express');
let router = express.Router();


// @route   GET api/lead
// Get all leads
router.get('/', async (req, res) => {
    const leads = await Lead.getLeadsWithClient();
    res.json(leads);
});

// @route   GET api/lead/:id
// Get lead by id
router.get("/lead/:id", async (req, res) => {
    const {id} = req.params;
    const lead = await Lead.getLeadWithClientById(id);
    if (!lead) {
        return res.status(404).send("Lead not found");
    }
    res.json(lead);
});


// @route   POST api/lead
// Create a lead from the webhook
router.post("/", async (req, res) => {
    console.log("Nova Lead Recebida")
    const body = req.body;
    const idCompany = body.company ? body.company.id : null;
    let client;
    if (idCompany) {
        client = await Client.findOne({where: {idCRM: body.company.id}});
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
    } else {
        client = null
    }
    const deal = await Lead.findOne({
        order: {
            id: "DESC"
        }
    });
    let id = 1;
    if (deal) {
        id = deal.id
    }
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const year_lastTwoDigits = year.toString().substr(-2)
    let month_twoDigits;
    if (month < 10) {
        month_twoDigits = '0' + month
    } else {
        month_twoDigits = month
    }
    const lead = await Lead.create({
        inner_id: "BLISQ" + year_lastTwoDigits + month_twoDigits + id,
        name: body.title,
        date: date,
        client: client,
        crmId: body.id,
    }).save();

    if (lead) {
        res.status(201).send("Lead created with id: " + lead.id);
    } else {
        res.status(400).send("Error creating lead");
    }
});

// @route   POST api/lead/
// Update a lead from the webhook
router.post("/update", async (req, res) => {
    const body = req.body;
    const idCompany = body.company ? body.company.id : null;
    const lead = await Lead.findOne({where: {crmId: req.body.id}});
    if (!lead) {
        res.status(404).send("Lead not found");
    }
    let client;
    if (idCompany) {
        console.log(body.company);
        client = await Client.findOne({where: {idCRM: body.company.id}});
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

                console.log("Cliente criado", client);
            }

        }
    } else {
        client = null
    }
    console.log("Cliente no fim", client);
    lead.client = client;

    const updatedLead = await lead.save()
    if (updatedLead) {
        res.status(201).send("Lead updated with id: " + lead.id);
    } else {
        res.status(400).send("Error updating lead");
    }


});

module.exports = router;