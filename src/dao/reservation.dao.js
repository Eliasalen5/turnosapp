import { Reservation } from '../models/reservation.model.js';

class ReservationDAO {
  async findAll(filter = {}, { sort = { createdAt: -1 }, populatePath = null } = {}) {
    const query = Reservation.find(filter).sort(sort).lean();
    if (populatePath) {
      query.populate(populatePath);
    }
    return query;
  }

  async findById(rid, { populatePath = null } = {}) {
    const query = Reservation.findById(rid).lean();
    if (populatePath) {
      query.populate(populatePath);
    }
    return query;
  }

  async create(data) {
    return Reservation.create(data);
  }

  async updateById(rid, update, options = {}) {
    return Reservation.findByIdAndUpdate(
      rid,
      update,
      { returnDocument: 'after', runValidators: true, ...options }
    );
  }

  async deleteById(rid) {
    return Reservation.findByIdAndDelete(rid);
  }
}

export const reservationDAO = new ReservationDAO();
