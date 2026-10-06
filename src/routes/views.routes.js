import { Router } from 'express';
import { viewsController } from '../controllers/views.controller.js';

const router = Router();

router.get('/', viewsController.home);
router.get('/reservations', viewsController.reservations);

export default router;
