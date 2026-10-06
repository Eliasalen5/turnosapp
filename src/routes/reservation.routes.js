import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createReservationSchema,
  addServiceSchema,
  updateQuantitySchema,
  mongoIdSchema,
  reservationServiceParamSchema,
} from '../validations/reservation.schema.js';

const router = Router();

router.get('/', reservationController.list);
router.get('/:rid', validate(mongoIdSchema, 'params'), reservationController.getById);
router.post('/', validate(createReservationSchema), reservationController.create);
router.post(
  '/:rid/services',
  validate(mongoIdSchema, 'params'),
  validate(addServiceSchema),
  reservationController.addService
);
router.put(
  '/:rid/services/:sid',
  validate(reservationServiceParamSchema, 'params'),
  validate(updateQuantitySchema),
  reservationController.updateServiceQuantity
);
router.delete(
  '/:rid/services/:sid',
  validate(reservationServiceParamSchema, 'params'),
  reservationController.removeService
);
router.delete(
  '/:rid/services',
  validate(mongoIdSchema, 'params'),
  reservationController.empty
);
router.delete('/:rid', validate(mongoIdSchema, 'params'), reservationController.remove);

export default router;
