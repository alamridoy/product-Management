let superAdminPermission = [
    'addCategory','categoryList','deleteCategory','categoryUpdate','categoryDetails',  // category access
    'productAdd','productList','produdctDetails','deleteProduct','productUpdate' ,
    'orderList' ,'orderDetails'// product create and update delete access
 
 ];
 
 let userPermission = [
     'productList','produdctDetails',    // product list and details access
     'createOrder','orderList' ,'orderDetails',
     "payment"                
 
 ];
 
 
 let getRouterPermissionList = async(id = 0) => {
     return new Promise((resolve, reject) => {
         if (id === 1) resolve(superAdminPermission);
         else if (id === 2) resolve(userPermission);
         else resolve([]);
     });
 }
 
 
 module.exports = {
     getRouterPermissionList
 }