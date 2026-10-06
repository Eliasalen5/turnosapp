import { Router } from 'express';
import serviceRoutes from './service.routes.js';
import reservationRoutes from './reservation.routes.js';

const router = Router();

router.use('/services', serviceRoutes);
router.use('/reservations', reservationRoutes);

export default router;
