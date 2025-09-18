import  Server  from './config/express';

const server = new Server();
const PORT = server.getPort();

server.start(async () => { console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`); });