import { reservationRepository } from '../repositories/reservation.repository.js';
import { serviceRepository } from '../repositories/service.repository.js';
import { HttpError } from '../utils/http-error.js';

function mergeItems(items) {
  const merged = new Map();
  for (const item of items) {
    const key = String(item.service);
    if (merged.has(key)) {
      merged.get(key).quantity += item.quantity;
    } else {
      merged.set(key, { service: item.service, quantity: item.quantity });
    }
  }
  return [...merged.values()];
}

class ReservationService {
  async list() {
    return reservationRepository.list();
  }

  async getById(rid) {
    const reservation = await reservationRepository.findById(rid);
    if (!reservation) {
      throw new HttpError(404, 'Reserva no encontrada');
    }
    return reservation;
  }

  async create({ services = [] }) {
    if (services.length > 0) {
      await this.#assertServicesExist(services.map((item) => item.service));
    }
    const created = await reservationRepository.create({ services: mergeItems(services) });
    return reservationRepository.findById(created._id);
  }

  async addService(rid, { service, quantity }) {
    const reservation = await this.#getReservation(rid);
    await this.#assertServicesExist([service]);

    const existing = reservation.services.find((item) => String(item.service) === service);
    if (existing) {
      await reservationRepository.updateItemQuantity(rid, service, existing.quantity + quantity);
    } else {
      await reservationRepository.addItem(rid, { service, quantity });
    }
    return reservationRepository.findById(rid);
  }

  async updateQuantity(rid, sid, quantity) {
    const reservation = await this.#getReservation(rid);
    this.#assertItemExists(reservation, sid);
    await reservationRepository.updateItemQuantity(rid, sid, quantity);
    return reservationRepository.findById(rid);
  }

  async removeService(rid, sid) {
    const reservation = await this.#getReservation(rid);
    this.#assertItemExists(reservation, sid);
    await reservationRepository.removeItem(rid, sid);
    return reservationRepository.findById(rid);
  }

  async empty(rid) {
    await this.#getReservation(rid);
    await reservationRepository.empty(rid);
    return reservationRepository.findById(rid);
  }

  async remove(rid) {
    const deleted = await this.#getReservation(rid);
    await reservationRepository.remove(rid);
    return deleted;
  }

  async #getReservation(rid) {
    const reservation = await reservationRepository.findById(rid, { populate: false });
    if (!reservation) {
      throw new HttpError(404, 'Reserva no encontrada');
    }
    return reservation;
  }

  #assertItemExists(reservation, sid) {
    const exists = reservation.services.some((item) => String(item.service) === sid);
    if (!exists) {
      throw new HttpError(404, 'El servicio no está asociado a la reserva');
    }
  }

  async #assertServicesExist(ids) {
    const uniqueIds = [...new Set(ids)];
    const found = await serviceRepository.findByIds(uniqueIds);
    if (found.length !== uniqueIds.length) {
      const foundIds = new Set(found.map((service) => String(service._id)));
      const missing = uniqueIds.filter((id) => !foundIds.has(String(id)));
      throw new HttpError(404, `Servicios inexistentes: ${missing.join(', ')}`);
    }
  }
}

export const reservationService = new ReservationService();
