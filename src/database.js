
import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();
const DBHOST= process.env.DBHOST;
const DBPORT= process.env.DBPORT;
const DBUSER= process.env.DBUSER;
const DBPASS= process.env.DBPASS;
const DBNAME= process.env.DBNAME;
const pool =createPool({
    host: DBHOST,
    port: DBPORT,
    user: DBUSER,
    password: DBPASS,
    database: DBNAME
});
export default pool;
