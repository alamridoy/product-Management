const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const moment = require("moment");
const orderModel = require('../models/order');
const productModel = require('../models/product');
const {routeAccessChecker} = require('../middlewares/routeAccess');
const commonObject = require('../common/common');





let current_date = new Date(); 
let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");





router.post('/add', [verifyToken, routeAccessChecker("createOrder")], async(req, res) => {
    let reqData = {
        "productIds": req.body.productIds,
    };

    reqData.userId = req.decoded.userInfo.id;
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;

    reqData.created_at = current_time;
    reqData.updated_at = current_time;

    // Validate productIds
    if (!Array.isArray(reqData.productIds) || reqData.productIds.length === 0) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Product IDs must be a non-empty array."
        });
    }

    let totalAmount = 0;

    for (let index = 0; index < reqData.productIds.length; index++) {
        const product_id = reqData.productIds[index];

        // Check if product ID exists in the database
        let existingById = await productModel.getById(product_id);
        if (isEmpty(existingById)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: `Product data not found for ID: ${product_id}`
            });
        }

        // Get product price and add it to totalAmount
        totalAmount += existingById[0].price;
    }

    reqData.totalAmount = totalAmount;

    
    reqData.productIds = JSON.stringify(reqData.productIds);
    reqData.status = 'pending' // default status pending

    let result = await orderModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something went wrong with the database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Order created successfully."
    });
});


// list
router.get('/list', [verifyToken, routeAccessChecker("orderList")], async (req, res) => {
    let reqData = {
        "limit": req.body.limit,
        "offset": req.body.offset,
        "price": req.body.price || 0
    };

    if (!(await commonObject.checkItsNumber(reqData.limit)).success || reqData.limit < 1) {
        reqData.limit = 50;
    }

    if (!(await commonObject.checkItsNumber(reqData.offset)).success || reqData.offset < 0) {
        reqData.offset = 0;
    }

    let result = await orderModel.getList(reqData.price, reqData.limit, reqData.offset);

    // Process each order and fetch the corresponding product details
    for (let index = 0; index < result.length; index++) {
        const element = result[index].productIds;
        let productIds = JSON.parse(element);

        
        let productDetails = [];

    
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];

            let productDetail = await productModel.getDetailsById(productId);


            if (productDetail && productDetail.length > 0) {
                productDetails.push({
                    id: productDetail[0].id,
                    name: productDetail[0].name,
                    description: productDetail[0].description,
                    price: productDetail[0].price
                });
            }
        }

        result[index].productDetails = productDetails;

        delete result[index].productIds
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Order List.",
        "count": result.length,
        "data": result
    });
});




//delete 
router.get("/details/:id", [verifyToken, routeAccessChecker("orderDetails")], async(req, res) => {


    let id = req.params.id;

    let validateId = await commonObject.checkItsNumber(id);


    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        id = validateId.data;
    }

    let result = await orderModel.getById(id);

    if (isEmpty(result)) {

        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });

    } 
    
    
    for (let index = 0; index < result.length; index++) {
    const element = result[index].productIds;
    let productIds = JSON.parse(element);

    
    let productDetails = [];


    for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];

        let productDetail = await productModel.getDetailsById(productId);


        if (productDetail && productDetail.length > 0) {
            productDetails.push({
                id: productDetail[0].id,
                name: productDetail[0].name,
                description: productDetail[0].description,
                price: productDetail[0].price
            });
        }
    }

 
    result[index].productDetails = productDetails;

    delete result[0].productIds
    delete result[0].created_at
    delete result[0].updated_at
    delete result[0].created_by
    delete result[0].updated_by
}

    return res.status(200).send({
        success: true,
        status: 200,
        essage: "Order Details.",
        data: result[0],
    });

});




module.exports = router;   










