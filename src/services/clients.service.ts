import  {getDB} from '../config/db.js';

export class ClientsService {
    public static async getAllClients() {
        const db = getDB();
        const [rows] = await db.query('SELECT * FROM clients');
        return rows;
    }
};