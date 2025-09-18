import mysql, {Pool} from 'mysql2/promise';
import ENV from './config';

export let pool: Pool;

try {
    pool = mysql.createPool({
    host: ENV.db.host,
    user: ENV.db.user,
    password: ENV.db.password,
    database: ENV.db.database,
    connectionLimit: 1,
    queueLimit: 0,
    });
}catch (error) {
    console.error("Error al conectar a la base de datos:", error);
}


export const closeDB = async () =>{
    if (pool){
        await pool.end();
        console.log("Conexión a la base de datos cerrada");
    }else{
        console.log("La base de datos no estaba inicializada");
    }
};
