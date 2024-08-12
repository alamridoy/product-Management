const express = require("express");
const router = express.Router();

const { connectionProductManagementMYSQL } = require('./connections/connection');
global.config = require('./jwt/config');



const authenticationRouter = require('./routers/authentication');
const categoryRouter = require('./routers/category');
const productRouter = require('./routers/product');
const orderRouter = require('./routers/order');
const paymentRouter = require('./routers/payment');



router.use('/authentication', authenticationRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use('/payment', paymentRouter);



module.exports = router;  