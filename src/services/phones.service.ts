import {pool} from '../config/db';

export class PhonesService{
    public static async getPhonesClientById(id:number) {
        const [rows] = await pool.execute('select numero from TELEFONOS where id_cliente=?', [id]);
        return rows;
    }
}