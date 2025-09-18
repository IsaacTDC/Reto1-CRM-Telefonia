import {Router} from 'express';
import clientRoutes from './client.routes';
import phonesRoutes from './phones.routes';

const router = Router();

router.get('/', (req, res) => {
    res.send('API corriendo');
});

router.use('/clients', clientRoutes);
router.use('/phones',phonesRoutes);

export default router;