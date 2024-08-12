let table_name = "flyfartech_orders";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByName = () => {
    return `SELECT * FROM ${table_name} where  category_id = ? and  status != 0`;
}

let getByTitle = () => {
    return `SELECT * FROM ${table_name} where  title = ? and status != 0`;
}

let getById = () => {
    return ` SELECT * FROM ${table_name} where  id = ? `;
}

let getByUserId = () => {
    return ` SELECT * FROM ${table_name} where  userId = ?  and status = 'pending' `;
}

let getList = (price = 0,limit = 50, offset = 0) => {

    let priceKey = price > 0 ? `AND o.totalAmount = ${price}` : "";
    
    return `
        SELECT 
            o.id,
            o.userId,
            o.productIds,
            o.totalAmount,
            o.status,
            o.created_at,
            o.updated_at,
            u.name AS user_name
        FROM 
            ${table_name} o
        LEFT JOIN
            flyfartech_users u ON o.userId = u.id  -- Adjust table name and join condition if needed
        WHERE 
            o.status != 0 ${priceKey}
        ORDER BY 
            o.id DESC
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
    getByUserId

}