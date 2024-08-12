const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const moment = require("moment")
const categoryModel = require('../models/category');
const {routeAccessChecker} = require('../middlewares/routeAccess');
const orderModel = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
var jwt = require('jsonwebtoken');

let checkItsNumber = async (value) => {
    let result = {
        success: false,
        data: value,
    };

    try {
        if (typeof value === "string") {
            result.data = parseFloat(value);
        }

        if (!isNaN(value) || (value !== "" && value !== null && value !== undefined)) {

            if ((typeof value === "number" && value >= 0) || (typeof value === "string" && (value == parseInt(value) || value == parseFloat(value)))) {
                result.success = true;
            }
        }
    } catch (error) { }

    //console.log(result);
    return result;
};
let current_date = new Date(); 
let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");



// payment
router.post('/charge', async (req, res) => {
    const { amount, token } = req.body;

    if (!token) {
        return res.status(400).send({
            success: false,
            message: "Invalid or missing token.",
        });
    }

    try {
        // Use the token to create a charge
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            source: token, // This is the token from the client side
            description: 'Charge for your product/service',
        });

        return res.status(201).send({
            success: true,
            message: 'Payment successful.',
            charge: charge, // Optional: You can return the charge object if needed
        });
    } catch (err) {
        console.error('Payment failed:', err);
        return res.status(500).send({
            success: false,
            message: 'Payment failed.',
            error: err.message,
        });
    }
});


router.post('/list', [verifyToken, routeAccessChecker("categoryList")], async(req, res) => {

    let reqData = {
        "limit": req.body.limit,
        "offset": req.body.offset,
        "key":req.body.key
    }

    if (!(await checkItsNumber(reqData.limit)).success || reqData.limit < 1) {
        reqData.limit = 50;
    }

    if (!(await checkItsNumber(reqData.offset)).success || reqData.offset < 0) {
        reqData.offset = 0
    }

    let result = await categoryModel.getList(reqData.key,reqData.limit, reqData.offset);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Category List.",
        "count": result.length,
        "data": result
    });
});


router.get("/details/:id", [verifyToken, routeAccessChecker("categoryDetails")], async(req, res) => {


    let id = req.params.id;

    let validateId = await checkItsNumber(id);


    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        id = validateId.data;
    }

    let result = await categoryModel.getById(id);

    if (isEmpty(result)) {

        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });

    } else {

        return res.status(200).send({
            success: true,
            status: 200,
            message: "Category Details.",
            data: result[0],
        });

    }

});









module.exports = router;   