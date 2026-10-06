import { reservationService } from '../services/reservation.service.js';
import { getIO } from '../config/socket.config.js';

class ReservationController {
  list = async (req, res, next) => {
    try {
      const reservations = await reservationService.list();
      res.json({ status: 'success', payload: reservations });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const reservation = await reservationService.getById(req.params.rid);
      res.json({ status: 'success', payload: reservation });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const reservation = await reservationService.create(req.body);
      getIO().emit('reservation:created', reservation);
      res.status(201).json({ status: 'success', payload: reservation });
    } catch (error) {
      next(error);
    }
  };

  addService = async (req, res, next) => {
    try {
      const reservation = await reservationService.addService(req.params.rid, req.body);
      getIO().emit('reservation:updated', reservation);
      res.status(201).json({ status: 'success', payload: reservation });
    } catch (error) {
      next(error);
    }
  };

  updateServiceQuantity = async (req, res, next) => {
    try {
      const reservation = await reservationService.updateQuantity(
        req.params.rid,
        req.params.sid,
        req.body.quantity
      );
      getIO().emit('reservation:updated', reservation);
      res.json({ status: 'success', payload: reservation });
    } catch (error) {
      next(error);
    }
  };

  removeService = async (req, res, next) => {
    try {
      const reservation = await reservationService.removeService(req.params.rid, req.params.sid);
      getIO().emit('reservation:updated', reservation);
      res.json({ status: 'success', payload: reservation });
    } catch (error) {
      next(error);
    }
  };

  empty = async (req, res, next) => {
    try {
      const reservation = await reservationService.empty(req.params.rid);
      getIO().emit('reservation:updated', reservation);
      res.json({ status: 'success', payload: reservation });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      const reservation = await reservationService.remove(req.params.rid);
      getIO().emit('reservation:deleted', { _id: reservation._id });
      res.json({ status: 'success', message: 'Reserva eliminada' });
    } catch (error) {
      next(error);
    }
  };
}

export const reservationController = new ReservationController();
