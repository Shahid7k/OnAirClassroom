// DATABASE CONNECTION
const db = require('../config/db');

//GET 
const getUserByField = async (field,fieldValue) => {
    const getQuery = `SELECT * FROM users WHERE $1:name = $2;`;
    let user = await db.one(getQuery, [field,fieldValue]);
	console.log(user);
    return user;
}

/* EXPORT */
module.exports = {
    getUserByField
}