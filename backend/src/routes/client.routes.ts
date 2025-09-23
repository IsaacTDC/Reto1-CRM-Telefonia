import {Router} from 'express';
import { ClientController } from '../controllers/clientController.controller';

const router = Router();

router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientById);

export default router;