import {Product} from "../entity/Product"

let express = require('express');
let router = express.Router();

router.get('/department/:id', async (req, res) => {
    const products = await Product.find({where: {department: req.params.id}});
    res.json(products);
});


module.exports = router;