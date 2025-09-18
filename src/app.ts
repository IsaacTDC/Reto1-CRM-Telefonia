import  Server  from './config/express.js';

const server = new Server();
const PORT = server.getPort();

server.start();