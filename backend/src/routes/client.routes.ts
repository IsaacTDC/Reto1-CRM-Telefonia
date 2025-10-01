import {Router} from 'express';
import { ClientController } from '../controllers/clientController.controller';

const router = Router();

router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientById);

router.put('/:id', ClientController.updateClient);// editar cliente
router.post('/', ClientController.createClient);
router.delete('/:id',ClientController.deleteClient);

export default router;