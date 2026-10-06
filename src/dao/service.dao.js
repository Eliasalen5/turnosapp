import { Service } from '../models/service.model.js';

class ServiceDAO {
  async findAll(filter = {}, { sort = {}, skip = 0, limit = 0 } = {}) {
    return Service.find(filter).sort(sort).skip(skip).limit(limit).lean();
  }

  async countAll(filter = {}) {
    return Service.countDocuments(filter);
  }

  async findById(sid) {
    return Service.findById(sid);
  }

  async create(data) {
    return Service.create(data);
  }

  async updateById(sid, data) {
    return Service.findByIdAndUpdate(sid, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  async deleteById(sid) {
    return Service.findByIdAndDelete(sid);
  }
}

export const serviceDAO = new ServiceDAO();
