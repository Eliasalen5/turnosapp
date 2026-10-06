import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres'],
    },
    category: {
      type: String,
      default: 'general',
      trim: true,
      maxlength: [50, 'La categoría no puede superar 50 caracteres'],
    },
    duration: {
      type: Number,
      default: 30,
      min: [1, 'La duración mínima es 1 minuto'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'El precio no puede ser negativo'],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);
