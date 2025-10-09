import * as dotenv from "dotenv";
import Joi from "joi";


const config = dotenv.config({path: "./.env"});

if (config.error){
    throw new Error(config.error.message);
}

const envSchema = Joi.object({ //configuramos las validaciones con JOI
    DB_HOST: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    PORT: Joi.number().default(3000),
    MAIL_USER: Joi.string().required(),
    MAIL_PASSWORD: Joi.string().required(),
}).unknown(true);

const {error, value } = envSchema.validate(process.env); //validamos 
if (error){
    throw new Error('Error en las variables de entorno: ${error.message}'); //si hay error enviamos mensaje
}

//exportamos el objeto con los datos
const ENV = {
    PORT:   value.PORT,
    db:{
        host: value.DB_HOST,
        user: value.DB_USER,
        password: value.DB_PASSWORD,
        database: value.DB_NAME,
        port: value.DB_PORT,
    },
};

export default ENV;