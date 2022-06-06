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
        "date": deal.date,
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
        "date": deal.date,
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
    const department = await Department.findOne({where: {id: body.departmentId}});


    //update department status
    await DealToDepartment.create({
        deal,
        department,
        status: body.departmentStatus
    }).save();


    if (!deal) {
        res.status(400).send("Deal not found");
    }

    const prodsId = body.products.map(product => product.id);
    let promisses = body.products.map(product => ProductToDeal.create({
            hours: product.hours,
            description: product.description,
            product,
            deal
        }).save()
    );
    await Promise.all(promisses)

    //remove extra products from deal

    //get all products from deal
    const products = await ProductToDeal.getDealsWithProducts(id);

    //get the ids from the products
    const productsIds = products.map(product => product.product.id);

    //get the difference between the ids and the prodsIds
    const productsToDelete = productsIds.filter(productId => !prodsId.includes(productId));
    if (productsToDelete.length > 0) {
        //find all products to delete
        const productsToDeleteRows = productsToDelete.map(productId => ProductToDeal.findOne({
            where: {
                product: {id: productId},
                deal: {id}
            },
        }));
        const productsToDeleteEntities = await Promise.all(productsToDeleteRows);
        const productsRemoved = await ProductToDeal.delete(productsToDeleteEntities);
    }
    res.status(200).send("Tasks added to deal");
});

// @rout    GET api/deal/:id/products
// Get all products of a deal filtered by department
router.get("/:idDeal/products/:idDepartment", async (req, res) => {
    const id = req.params.idDeal;
    const departmentId = req.params.idDepartment;

    const result = await Product.getProductsInDealByDepartment(parseInt(id), parseInt(departmentId));

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
        date: deal.date,
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

router.get("/:id/departmentStatus/:idDepartment", async (req, res) => {
    const {id} = req.params;
    const {idDepartment} = req.params;
    const deal = await Deal.findOne({where: {id}});
    if (!deal) {
        return res.status(404).send("Deal not found");
    }
    const status = await Deal.getStatusOfDepartmentByDealId(parseInt(id),parseInt(idDepartment));
    res.json(status);
});

module.exports = router;