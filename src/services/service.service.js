import { serviceRepository } from '../repositories/service.repository.js';
import { HttpError } from '../utils/http-error.js';

class ServiceService {
  async list(query) {
    return serviceRepository.list(query);
  }

  async getById(sid) {
    const service = await serviceRepository.findById(sid);
    if (!service) {
      throw new HttpError(404, 'Servicio no encontrado');
    }
    return service;
  }

  async create(data) {
    return serviceRepository.create(data);
  }

  async update(sid, data) {
    if (Object.keys(data).length === 0) {
      throw new HttpError(400, 'No se enviaron campos para actualizar');
    }
    const updated = await serviceRepository.update(sid, data);
    if (!updated) {
      throw new HttpError(404, 'Servicio no encontrado');
    }
    return updated;
  }

  async remove(sid) {
    const deleted = await serviceRepository.remove(sid);
    if (!deleted) {
      throw new HttpError(404, 'Servicio no encontrado');
    }
    return deleted;
  }
}

export const serviceService = new ServiceService();
