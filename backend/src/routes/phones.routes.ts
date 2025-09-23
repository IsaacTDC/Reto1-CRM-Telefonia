import {Router} from 'express';
import {PhonesController} from '../controllers/phones.controller';

const router = Router();

router.get('/:id', PhonesController.getAllPhonesClientById);

export default router;
