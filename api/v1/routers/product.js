const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const moment = require("moment");
const categoryModel = require('../models/category');
const productModel = require('../models/product');
const {routeAccessChecker} = require('../middlewares/routeAccess');
const commonObject = require('../common/common');





let current_date = new Date(); 
let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");




//add
router.post('/add', [verifyToken, routeAccessChecker("productAdd")], async(req, res) => {

    let reqData = {
        "category_id" : req.body.category_id,
        "name": req.body.name,
        "description": req.body.description,
        "price" : req.body.price,
        "stock_quantity": req.body.stock_quantity,
    }


    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;

    reqData.created_at = current_time;
    reqData.updated_at = current_time;



    // category id validate
    if(isEmpty(reqData.category_id)){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Category id should not be empty."
        });
    }


    let validateCategoryId = await commonObject.checkItsNumber(reqData.category_id);
    if (validateCategoryId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Category Id should be integer.",
        });
    } else {
        req.body.category_id = validateCategoryId.data;
        reqData.category_id = validateCategoryId.data;
    }


    //existing in category id
    let existingDataById = await categoryModel.getById(reqData.category_id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Category data not found",
        });
    }



    // Validate product name
    if (isEmpty(reqData.name)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Product name cannot be empty."
        });
    } else if (reqData.name.length > 50) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Product name maximum length is 50 characters."
        });
    }


    // check duplicate value
    let existingData = await productModel.getByProductName(reqData.category_id,reqData.name);

    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This product Already Exists." : "This product Already Exists but Deactivate, You can activate it."
        });

    }



    // price validate
    if(isEmpty(reqData.price)){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Price should not be empty."
        });
    }


    let validatePrice = await commonObject.checkItsNumber(reqData.price);
    if (validatePrice.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Price should be integer.",
        });
    } else {
        req.body.price = validatePrice.data;
        reqData.price = validatePrice.data;
    }

    if (reqData.price < 0) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Invalid price.",
        });
    }
    
    


    // validate stock quantity
    if(isEmpty(reqData.stock_quantity)){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Stock quantity should not be empty."
        });
    }


    let validateStock = await commonObject.checkItsNumber(reqData.stock_quantity);
    if (validateStock.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Stock quantity should be integer.",
        });
    } else {
        req.body.stock_quantity = validateStock.data;
        reqData.stock_quantity = validateStock.data;
    }

    if (reqData.stock_quantity < 0) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Invalid stock quantity amount.",
        });
    }



    let result = await productModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Product Added Successfully."
    });

});


// list
router.get('/list', [verifyToken, routeAccessChecker("productList")], async(req, res) => {

    let reqData = {
        "limit": req.body.limit,
        "offset": req.body.offset,
        "key":req.body.key,
        "category_id": req.body.category_id
    }

    if (!(await commonObject.checkItsNumber(reqData.limit)).success || reqData.limit < 1) {
        reqData.limit = 50;
    }

    if (!(await commonObject.checkItsNumber(reqData.offset)).success || reqData.offset < 0) {
        reqData.offset = 0
    }

    let result = await productModel.getList(reqData.category_id,reqData.key,reqData.limit, reqData.offset);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Product List.",
        "count": result.length,
        "data": result
    });
});




// details
router.get("/details/:id", [verifyToken, routeAccessChecker("produdctDetails")], async(req, res) => {


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

    let result = await productModel.getById(id);

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
            message: "Product Details.",
            data: result[0],
        });

    }

});






//delete
router.delete('/delete/:id', [verifyToken, routeAccessChecker('deleteProduct')], async (req, res) => {

    let id = req.params.id;

    // Get id-wise data from the database
    let existingById = await productModel.getById(id);

    // Check if the id exists in the database
    if (isEmpty(existingById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Product data not found."
        });
    } 



    let data = {
        status: 0,  // status = 1 (active) and status = 0 (deleted)
        updated_at: current_time
    }

    // Update the record by id, setting status to 0 (soft delete)
    let result = await productModel.updateById(id, data);

    if (!result.affectedRows || result.affectedRows < 1) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Something went wrong in the system database."
        });
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Product successfully deleted."
    });

});



// update
router.put('/update/:id', [verifyToken, routeAccessChecker("productUpdate")], async(req, res) => {

    let reqData = {
        "category_id" : req.body.category_id,
        "name": req.body.name,
        "description": req.body.description,
        "price" : req.body.price,
        "stock_quantity": req.body.stock_quantity,
    }
    let id = req.params.id;

    reqData.updated_by = req.decoded.userInfo.id;

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integers",
            "id": id

        });
    } else {
        req.params.id = validateId.data;
        id = validateId.data;
    }

    let existingDataById = await productModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",
        });
    }

    let updateData = {};

    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;


    // category id validate
    if (existingDataById[0].category_id != reqData.category_id) {
        let validateCategoryId= await commonObject.checkItsNumber(reqData.category_id);
        if (validateCategoryId.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Category id should be integer.",
            });
        } 
        reqData.category_id = validateCategoryId.data;
        willWeUpdate = 1
        updateData.category_id = reqData.category_id

    }



    // validate product name
    if (existingDataById[0].name !== reqData.name) {
      console.log("ssslll",reqData.category_id)
      console.log("ssssdds",reqData.name)
        // check duplicate value
        let existingData = await productModel.getByName(reqData.category_id);
        if(existingData[0].name  == reqData.name){
            return res.status(409).send({
                "success": false,
                "status": 409,
                "message": existingData[0].status == "1" ? "This product name Already Exists." : "This product Already Exists but Deactivate, You can activate it."
            });
        }

        willWeUpdate = 1
        updateData.name = reqData.name

    }  


        // validate description
        if (existingDataById[0].description !== reqData.description) {
    
            willWeUpdate = 1
            updateData.description = reqData.description
    
        }  



    //price validate
    if (existingDataById[0].price !== reqData.price) {
        let validatePrice= await commonObject.checkItsNumber(reqData.price);
        if (validatePrice.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Price should be integer.",
            });
        } 

        if (reqData.price < 0) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Invalid price.",
            });
        }

        reqData.price = validatePrice.data;
        willWeUpdate = 1
        updateData.price = reqData.price

    }


    // space
    if (existingDataById[0].stock_quantity !== reqData.stock_quantity) {
        let validateStockQuantity = await commonObject.checkItsNumber(reqData.stock_quantity);
        if (validateStockQuantity.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Stock quantity should be integer.",
            });
        } 
    
        reqData.stock_quantity = validateStockQuantity.data;
        willWeUpdate = 1
        updateData.stock_quantity = reqData.stock_quantity
    }


    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    if (willWeUpdate == 1) {

        updateData.updated_by = req.decoded.userInfo.id;
        updateData.updated_at = current_time;


        let result = await productModel.updateById(id, updateData);


        if (result.affectedRows == undefined || result.affectedRows < 1) {
            return res.status(500).send({
                "success": true,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }


        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Product successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});





module.exports = router;   