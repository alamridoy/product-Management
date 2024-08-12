const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const moment = require("moment")
const {routeAccessChecker} = require('../middlewares/routeAccess');
const orderModel = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();


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





module.exports = router;   