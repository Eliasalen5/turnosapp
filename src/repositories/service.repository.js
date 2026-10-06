import { serviceDAO } from '../dao/service.dao.js';

class ServiceRepository {
  async list({ q, category, available, page, limit, sort, order }) {
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }
    if (available !== undefined) {
      filter.available = available;
    }

    const sortSpec = { [sort]: order === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      serviceDAO.findAll(filter, { sort: sortSpec, skip, limit }),
      serviceDAO.countAll(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
    };
  }

  async findById(sid) {
    return serviceDAO.findById(sid);
  }

  async findByIds(ids) {
    return serviceDAO.findAll({ _id: { $in: ids } });
  }

  async create(data) {
    return serviceDAO.create(data);
  }

  async update(sid, data) {
    return serviceDAO.updateById(sid, data);
  }

  async remove(sid) {
    return serviceDAO.deleteById(sid);
  }
}

export const serviceRepository = new ServiceRepository();
