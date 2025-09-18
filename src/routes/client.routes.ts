import {Router} from 'express';
import { ClientController } from '../controllers/clientController.controller.js';

const router = Router();

router.get('/', (req, res) => {
    res.send('API corriendo');
});

// Obtener todos los clientes
router.get('/clients', ClientController.getAllClients);

export default router;