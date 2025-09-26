import {Router} from 'express';
import { ClientController } from '../controllers/clientController.controller';

const router = Router();

router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientById);
// editar cliente
router.put('/:id', ClientController.updateClient);

export default router;