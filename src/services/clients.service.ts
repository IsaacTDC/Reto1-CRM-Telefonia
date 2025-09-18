import  {pool} from '../config/db';

export class ClientsService {

    public static async getAllClients() {
        const [rows] = await pool.execute('SELECT * FROM CLIENTES');
        return rows;
    }

    public static async getClientById(id: number){
        const [row] = await pool.execute('Select nombre from CLIENTES where id=?', [id]);
        return row;
    }

};