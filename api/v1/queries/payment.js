let table_name = "flyfartech_payment";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByName = () => {
    return `SELECT * FROM ${table_name} where  name = ? and status != 0`;
}

let getList = (key = "", limit = 50, offset = 0) => {
    let searchClause = key ? `AND name LIKE '%${key}%'` : "";
    return `
        SELECT * FROM ${table_name}
        WHERE status = 1 ${searchClause}
        ORDER BY id ASC
        LIMIT ${limit}
        OFFSET ${offset}
    `;
}


let getById = () => {
    return `SELECT id,name,status FROM ${table_name} where  id = ? and status = 1 `;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}




module.exports = {
    addNew,
    getByName,
    getList,
    getById,
    updateById
 

}