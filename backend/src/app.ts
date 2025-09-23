import { initDB } from './config/db';
import  Server  from './config/express';
import "reflect-metadata";

const server = new Server();
const PORT = server.getPort();

server.start(async () => { 
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
    await initDB();
});