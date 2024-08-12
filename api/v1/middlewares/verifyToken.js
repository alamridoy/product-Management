var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const isEmpty = require("is-empty");
const keyData =  require('../jwt/config');
const userModel = require('../models/user')

const routePermissionModel = require('../permission/route_permisson');



router.use(async function (req, res, next) {
    const token = req.headers['x-access-token'];
    let decoded; 
  
    try {
      if (!token) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Unauthorized Request",
        });
      }
  
      decoded = await jwt.verify(token, "flyfartech", { algorithm: 'HS256' });

      // Fetch user data
      const userData = await userModel.getUserInfo(decoded.id);
  
      // Build the final decoded object
      decoded.userInfo = {
        id: userData[0].id,
        name: userData[0].name,
        email: userData[0].email,
        status: userData[0].status,
        role_id: userData[0].role_id,
      };

      decoded.permissions = await routePermissionModel.getRouterPermissionList(userData[0].role_id);
  
      req.decoded = decoded;
      next();
    } catch (err) {
      console.error(err); // Log the actual error for debugging
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid Token or Timeout. Please Login First",
      });
    }
  });


module.exports = router;
