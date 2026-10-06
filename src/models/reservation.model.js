import mongoose from 'mongoose';

const reservationItemSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'El servicio es obligatorio'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1'],
    },
  },
  { _id: false }
);

const reservationSchema = new mongoose.Schema(
  {
    services: {
      type: [reservationItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model('Reservation', reservationSchema);
