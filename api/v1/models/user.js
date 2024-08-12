const { connectionProductManagementMYSQL } = require('../connections/connection');
const queries = require('../queries/user');



let getUserByEmail = async (email = "") => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getUserByEmail(), [email], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNew = async (info) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.addNew(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUserInfo = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionProductManagementMYSQL.query(queries.getUserById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



module.exports = {
    getUserByEmail,
    addNew,
    getUserInfo
}