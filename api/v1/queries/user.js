let table_name = "flyfartech_users";


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getUserById = () => {
    return `SELECT id, role_id,name, email, password ,status FROM ${table_name} where  id = ?  and status = 1 `;
}


module.exports = {
    getUserByEmail,
    addNew,
    getUserById
}