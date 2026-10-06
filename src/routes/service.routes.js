import { Router } from 'express';
import { serviceController } from '../controllers/service.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createServiceSchema,
  updateServiceSchema,
  listServicesQuerySchema,
  mongoIdSchema,
} from '../validations/service.schema.js';

const router = Router();

router.get('/', validate(listServicesQuerySchema, 'query'), serviceController.list);
router.get('/:sid', validate(mongoIdSchema, 'params'), serviceController.getById);
router.post('/', validate(createServiceSchema), serviceController.create);
router.put(
  '/:sid',
  validate(mongoIdSchema, 'params'),
  validate(updateServiceSchema),
  serviceController.update
);
router.delete('/:sid', validate(mongoIdSchema, 'params'), serviceController.remove);

export default router;
