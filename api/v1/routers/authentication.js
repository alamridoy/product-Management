const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const {check,validationResult} = require('express-validator')
const keyData =  require('../jwt/config');
const userModel = require('../models/user');




// registration
router.post('/registration',async (req, res) => {

    // body data
    let reqData = {
            "name":req.body.name,
            // "phone":req.body.phone,
            "email": req.body.email,
            "password":req.body.password,
          }

    
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    reqData.created_at = current_time;
    reqData.role_id = 2

 
  // check name validation
  if (isEmpty(reqData.name)) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": "Name should not be empty."
    });
  } else if (!/^[a-zA-Z]+$/.test(reqData.name)) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": "Name should only contain alphabetic characters."
    });
  } else if (reqData.name.length > 50) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": "Name length should not be grather than 50 characters."
    });
  }


   
  // // Check phone validation
  // if (isEmpty(reqData.phone)) {
  //   return res.status(400).send({
  //     "success": false,
  //     "status": 400,
  //     "message": "Phone should not be empty."
  //   });
  // } else if (!/^01\d{9}$/.test(reqData.phone)) {
  //   return res.status(400).send({
  //     "success": false,
  //     "status": 400,
  //     "message": "Please provide a valid phone number."
  //   });
  // }



  // email validation
  if (isEmpty(reqData.email)) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": "email should not be empty."
    });
  } 

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(reqData.email)) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": "Please provide a valid email address."
    });
  }
  

    // this email check unique
    let existingByEmail = await userModel.getUserByEmail(reqData.email)
    if(!isEmpty(existingByEmail)){
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message":"This email already exists."
       });
    }

  //check password validation
    if (isEmpty(reqData.password)) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Password should not be empty."
      });
    } else if (reqData.password.length < 6) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Incorrect password length please give minimun 6 digits."
      });
    }

  // password hashing
  reqData.password = bcrypt.hashSync(reqData.password,10)


   // save in database
   let result = await userModel.addNew(reqData);

   if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": true,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Registration Successfully."
    });
});




//login
router.post('/login', async (req, res) => {

    // Body data
    let reqData = {
      "email": req.body.email,
      "password": req.body.password,
    }

  // email validation

  if (isEmpty(reqData.email)) {
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": "email should not be empty."
        });
    } 

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(reqData.email)) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": "Please provide a valid email address."
    });
  }
  
  
    // Get user info
    let existingByUserInfo = await userModel.getUserByEmail(reqData.email);
    if (isEmpty(existingByUserInfo)) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "This email does not match."
      });
    }
    

    // Check password

    if (isEmpty(reqData.password)) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Password should not be empty."
      });
    }

    const isPasswordValid = await bcrypt.compare(reqData.password, existingByUserInfo[0].password);
    if (!isPasswordValid) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid password. Please try again with the correct password."
      });
    }


let data = {
  id: existingByUserInfo[0].id,
  name: existingByUserInfo[0].name,
  email:existingByUserInfo[0].email 
}

    // Create and sign a JWT token
    const token = jwt.sign({ id: existingByUserInfo[0].id, name:existingByUserInfo[0].name,mail: existingByUserInfo[0].email},keyData.secretKey, {'expiresIn':'1h'});

  
    // Respond with the token
    return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Login Successfully.",
      "token": token
    });
  });



module.exports = router;  