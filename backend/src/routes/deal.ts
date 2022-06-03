import {Deal} from "../entity/Deal"
import {User} from "../entity/User"
import {Department} from "../entity/Department"
import {DealToDepartment} from "../entity/DealToDepartment"
import {ProductToDeal} from "../entity/ProductToDeal"
import {Product} from "../entity/Product"

let express = require('express');
let router = express.Router();



// @route   GET api/deals
// Get all deals with the departments and clients
router.get('/', async (req, res) => {

    const deals = await Deal.getDealWithDepartments();
    const dealsFormatted = deals.map(deal => ({
        "id": deal.id,
        "inner_id": deal.inner_id,
        "status": deal.status,
        "clientStatus": deal.clientStatus,
        "timings": deal.timings,
        "work": deal.work,
        "client": deal.client,
        "departments": deal.dealToDepartments.map(({department}) => ({
            "id": department.id,
            "name": department.name,
            "status": department.initials
        }))
    }));
    res.json(dealsFormatted);
});

// @route   POST api/deal
// Create a deal
router.post("/", async (req, res) => {
    const {client, departmentsId, clientStatus, inner_id, status, work, timings} = req.body;
    const date = new Date();

    const user = await User.findOne();
    const departments = [];

    for (const departmentId of departmentsId) {
        const department = await Department.findOne({where: {id: departmentId}});
        if (!department) {
            res.status(400).send("Department not found")
        }
        departments.push(department);
    }

    const deal = await Deal.create({
        client,
        user,
        date,
        clientStatus,
        status,
        inner_id,
        work,
        timings,
    }).save();

    let promisses = departments.map(department => DealToDepartment.create({
            status: false,
            deal,
            department
        }).save()
    );
    await Promise.all(promisses);


    if (deal) {
        res.status(201).send("Deal created with id: " + deal.id);
    } else {
        res.status(400).send("Error creating deal");
    }
});



// @route   GET api/deals/:id
// Get one deal by id with the departments and clients
router.get("/:id", async (req, res) => {

    const {id} = req.params;
    const deal = await Deal.getDealWithDepartmentById(parseInt(id));
    if (!deal) {
        return res.status(404).send("Deal not found");
    }
    const dealFormatted = {
        "id": deal.id,
        "inner_id": deal.inner_id,
        "status": deal.status,
        "clientStatus": deal.clientStatus,
        "timings": deal.timings,
        "work": deal.work,
        "client": deal.client,
        "departments": deal.dealToDepartments.map(({department}) => ({
            "id": department.id,
            "name": department.name,
            "status": department.initials
        })),
    }
    res.json(dealFormatted);
});


// @route   POST api/deals/:id/products
// Add products to a deal
router.post("/:id/products", async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const deal = await Deal.findOne({where: {id}});

    if (!deal) {
        res.status(400).send("Deal not found");
    }
    console.log("body",body);

    let promisses = body.map(product => ProductToDeal.create({
            hours: product.hours,
            description: product.description,
            product,
            deal
        }).save()
    );
    await Promise.all(promisses)

    res.status(200).send("Tasks added to deal");
});

// @rout    GET api/deal/:id/products
// Get all products of a deal filtered by department
router.get("/:idDeal/products/:idDepartment", async (req, res) => {
    const id = req.params.idDeal;
    const departmentId = req.params.idDepartment;

    const result = await Product.getProductsInDealByDepartment(parseInt(id), parseInt(departmentId));
    console.log(result);

    res.json(result);
});

// @route   GET api/deal/department/:id
// Get the deals that are assigned to a department
router.get("/department/:id", async (req, res) => {
    const {id} = req.params;
    const deals = await Deal.getDealByDepartmentId(parseInt(id));

    const dealsFormatted = deals.map(deal => ({
        id: deal.id,
        client: deal.client,
        clientStatus: deal.clientStatus,
        status: deal.status,
        inner_id: deal.inner_id,
        work: deal.work,
        timings: deal.timings,
        departments: deal.dealToDepartments.map(({status, department}) => ({
            status,
            id: department.id,
            name: department.name,
            initials: department.initials
        })),
    }))

    res.json(dealsFormatted);
});

module.exports = router;