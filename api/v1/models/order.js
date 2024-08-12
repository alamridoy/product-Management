const { connectionProductManagementMYSQL } = require('../connections/connection');
const queries = require('../queries/order');



let addNew = async (info) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.addNew(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result);
        });
    });
};



let getByName = async(category_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getByName(), [category_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getList = async (price = 0,limit = 50, offset = 0) => {
    return new Promise((resolve, reject) => {
        const query = queries.getList(price, limit, offset);
        connectionProductManagementMYSQL.query(query, (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}



let getById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getByUserId = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getByUserId(), [UserId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let getByArtistId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getByArtistId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getDetailsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let updateById = async (id = 0, data = {}) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.updateById(), [data, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}





module.exports = {
   addNew,
   getByName,
   getList,
   getById,
   updateById,
   getByArtistId,
   getDetailsById,
   getByUserId
     
  
}