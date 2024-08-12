const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const moment = require("moment")
const categoryModel = require('../models/category');
const {routeAccessChecker} = require('../middlewares/routeAccess');
const commonObject = require('../common/common');



let current_date = new Date(); 
let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");


//add
router.post('/add', [verifyToken, routeAccessChecker('addCategory')], async (req, res) => {

    let reqData = {
        name: req.body.name,
    };

    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;

    reqData.created_at = current_time;



    // Validate category name
    if (isEmpty(reqData.name)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Category name cannot be empty."
        });
    } else if (reqData.name.length > 50) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Category name maximum length is 50 characters."
        });
    }

    // Check if the category already exists
    let existingData = await categoryModel.getByName(reqData.name);

    if (!isEmpty(existingData)) {
        return res.status(409).send({
            success: false,
            status: 409,
            message: existingData[0].status == "1" ? 
                     "This category already exists." : 
                     "This category already exists but is deactivated. You can activate it."
        });
    }

    // Add new category
    let result = await categoryModel.addNew(reqData);

    if (!result.affectedRows || result.affectedRows < 1) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Something went wrong in the system database."
        });
    }

    return res.status(201).send({
        success: true,
        status: 201,
        message: "Category added successfully."
    });
});



// list
router.post('/list', [verifyToken, routeAccessChecker("categoryList")], async(req, res) => {

    let reqData = {
        "limit": req.body.limit,
        "offset": req.body.offset,
        "key":req.body.key
    }

    if (!(await commonObject.checkItsNumber(reqData.limit)).success || reqData.limit < 1) {
        reqData.limit = 50;
    }

    if (!(await commonObject.checkItsNumber(reqData.offset)).success || reqData.offset < 0) {
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



// details
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




//delete
router.delete('/delete', [verifyToken, routeAccessChecker('deleteCategory')], async (req, res) => {

    let id = req.body.id;

    // Get id-wise data from the database
    let existingById = await categoryModel.getById(id);

    // Check if the id exists in the database
    if (isEmpty(existingById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Category data not found."
        });
    } 



    let data = {
        status: 0,  // status = 1 (active) and status = 0 (deleted)
        updated_at: current_time
    }

    // Update the record by id, setting status to 0 (soft delete)
    let result = await categoryModel.updateById(id, data);

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
        message: "Category successfully deleted."
    });

});




//update
router.put('/update', [verifyToken, routeAccessChecker("categoryUpdate")], async(req, res) => {

    let reqData = {
        "id": req.body.id,
        "name": req.body.name
    }

    reqData.updated_by = req.decoded.userInfo.id;

    let validateId = await checkItsNumber(reqData.id);
    if (validateId.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer.",
            "id": reqData.id

        });
    } else {
        req.body.id = validateId.data;
        reqData.id = validateId.data;

    }

    let existingDataById = await categoryModel.getById(reqData.id);
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

    // name
    if (existingDataById[0].name !== reqData.name) {

        let existingDataByname = await categoryModel.getByName(reqData.data);

            if (!isEmpty(existingDataByname) && existingDataByname[0].id != reqData.id) {

                isError = 1;
                errorMessage += existingDataByname[0].status == "1" ? "This category Already Exist." : "This category Already Exist but Deactivate, You can activate it."
            }

            willWeUpdate = 1;
            updateData.name = reqData.name;

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


        let result = await categoryModel.updateById(reqData.id, updateData);


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
            "message": "Category successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});


// validator common function
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

