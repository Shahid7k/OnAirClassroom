const pgp = require('pg-promise')();
//temp connection string before switching to .env
const connectionString = "postgres://postgres:groot@localhost:5432/onairclassroom";
const db = pgp(connectionString);

module.exports = db