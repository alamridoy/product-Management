let table_name = "flyfartech_products";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByName = () => {
    return `SELECT * FROM ${table_name} where  category_id = ? and  status != 0`;
}

let getByProductName = () => {
    return `SELECT * FROM ${table_name} where  category_id = ? and name = ? and  status != 0`;
}


let getByTitle = () => {
    return `SELECT * FROM ${table_name} where  title = ? and status != 0`;
}


let getDetailsById = () => {
    return `SELECT id,name,description,price FROM ${table_name} where id = ? and  status = 1`;
}

let getById = () => {
    return ` SELECT 
            p.id,
            p.category_id,
            c.name AS category_name,  -- Category name from the joined table
            p.name AS product_name,
            p.description,
            p.price,
            p.stock_quantity,
            p.status
        FROM 
            ${table_name} p
        JOIN 
            flyfartech_category c ON p.category_id = c.id
        WHERE 
            p.id = ? and p.status = 1 
        ORDER BY 
            p.id DESC`;
}


let getList = (category_id = 0, key = "", limit = 50, offset = 0) => {
    let searchName = key ? `AND p.name LIKE '%${key}%'` : "";
    let category = category_id ? `AND p.category_id = ${category_id}` : "";
    
    return `
        SELECT 
            p.id,
            p.category_id,
            c.name AS category_name,  -- Category name from the joined table
            p.name AS product_name,
            p.description,
            p.price,
            p.stock_quantity,
            p.status
        FROM 
            ${table_name} p
        JOIN 
            flyfartech_category c ON p.category_id = c.id
        WHERE 
            p.status = 1 ${category} ${searchName}
        ORDER BY 
            p.id DESC
        LIMIT 
            ${limit}
        OFFSET 
            ${offset}`;
}



const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}

module.exports = {
    addNew,
    getByName,
    getList,
    getById,
    updateById,
    getByTitle,
    getDetailsById,
    getByProductName

}