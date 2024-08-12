const { connectionProductManagementMYSQL } = require('../connections/connection');
const queries = require('../queries/category');


let addNew = async (info) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.addNew(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getByName = async(name = "") => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getByName(), [name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let getList = async (key = "", limit = 50, offset = 0) => {
    return new Promise((resolve, reject) => {
        const query = queries.getList(key, limit, offset);
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
   updateById
  
}