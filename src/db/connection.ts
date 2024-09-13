import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ss9095504",
  database: "expatra",
});

export default connection;
