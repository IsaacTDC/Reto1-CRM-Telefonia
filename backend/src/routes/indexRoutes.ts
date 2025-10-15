import {Router} from 'express';
import clientRoutes from './client.routes';
import phonesRoutes from './phones.routes';
import consumptionRoutes from "./consumption.routes";
import mailRoutes from './mail.routes';
import userRoutes from './user.routes';

const router = Router();

/* router.get('/', (req, res) => {
    res.send('API corriendo');
}); */

router.use('/clients', clientRoutes);
router.use('/phones',phonesRoutes);
router.use('/consumptions',consumptionRoutes);
router.use('/users', userRoutes);

router.use('/mail', mailRoutes);

export default router;