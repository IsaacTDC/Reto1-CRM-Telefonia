import mysql, {Pool} from 'mysql2/promise';
import ENV from "./config.js";

let pool: Pool;

export const initDB =  () =>{
    pool = mysql.createPool({
        host: ENV.db.host,
        user: ENV.db.user,
        password: ENV.db.password,
        database: ENV.db.database,
        connectionLimit: 1,
        queueLimit: 0,
    });
};

export const getDB = () =>{
    if (!pool){
        throw new Error("La base de datos no ha sido inicializada");
    }
    return pool;
};