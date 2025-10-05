import mysql, {Pool} from 'mysql2/promise';
import ENV from './config';
import { DataSource } from "typeorm"
import path from 'path';

export let pool: Pool;


export const AppDataSource = new DataSource({ //objeto para typeorm
    type: "mysql",
    host: ENV.db.host,
    port: 3306,
    username: ENV.db.user,
    password: ENV.db.password,
    database: ENV.db.database,
    entities: [path.join(__dirname, "../entities/*")],
    synchronize: true,
    //logging: false,
})

export const initDB = async () =>{ //función para inicializar la DB
    try{
        await AppDataSource.initialize();
        console.log("Base de datos inicializada");
    }
    catch (error){
        console.log( error);
    }
};

/* try {
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
 */