import { serviceService } from '../services/service.service.js';
import { reservationService } from '../services/reservation.service.js';

class ViewsController {
  home = async (req, res, next) => {
    try {
      const { items } = await serviceService.list({
        page: 1,
        limit: 100,
        sort: 'createdAt',
        order: 'desc',
      });
      res.render('home', {
        title: 'Servicios',
        services: items,
      });
    } catch (error) {
      next(error);
    }
  };

  reservations = async (req, res, next) => {
    try {
      const reservations = await reservationService.list();
      res.render('reservations', {
        title: 'Reservas',
        reservations,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const viewsController = new ViewsController();
