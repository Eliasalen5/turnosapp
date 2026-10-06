import { serviceService } from '../services/service.service.js';
import { getIO } from '../config/socket.config.js';

class ServiceController {
  list = async (req, res, next) => {
    try {
      const { items, pagination } = await serviceService.list(req.query);
      res.json({ status: 'success', payload: items, pagination });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const service = await serviceService.getById(req.params.sid);
      res.json({ status: 'success', payload: service });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const service = await serviceService.create(req.body);
      getIO().emit('service:created', service);
      res.status(201).json({ status: 'success', payload: service });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const service = await serviceService.update(req.params.sid, req.body);
      getIO().emit('service:updated', service);
      res.json({ status: 'success', payload: service });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      const service = await serviceService.remove(req.params.sid);
      getIO().emit('service:deleted', { _id: service._id });
      res.json({ status: 'success', message: 'Servicio eliminado' });
    } catch (error) {
      next(error);
    }
  };
}

export const serviceController = new ServiceController();
