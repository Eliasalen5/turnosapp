import { reservationDAO } from '../dao/reservation.dao.js';

const POPULATE_PATH = { path: 'services.service' };

class ReservationRepository {
  async list() {
    return reservationDAO.findAll({}, { populatePath: POPULATE_PATH });
  }

  async findById(rid, { populate = true } = {}) {
    return reservationDAO.findById(rid, { populatePath: populate ? POPULATE_PATH : null });
  }

  async create(data) {
    return reservationDAO.create(data);
  }

  async addItem(rid, item) {
    return reservationDAO.updateById(rid, { $push: { services: item } });
  }

  async updateItemQuantity(rid, sid, quantity) {
    return reservationDAO.updateById(
      rid,
      { $set: { 'services.$[elem].quantity': quantity } },
      { arrayFilters: [{ 'elem.service': sid }] }
    );
  }

  async removeItem(rid, sid) {
    return reservationDAO.updateById(rid, { $pull: { services: { service: sid } } });
  }

  async empty(rid) {
    return reservationDAO.updateById(rid, { $set: { services: [] } });
  }

  async remove(rid) {
    return reservationDAO.deleteById(rid);
  }
}

export const reservationRepository = new ReservationRepository();
