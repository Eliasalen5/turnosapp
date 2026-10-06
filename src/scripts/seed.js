import { connectDB } from '../config/db.config.js';
import { Service } from '../models/service.model.js';

const samples = [
  {
    name: 'Corte de pelo',
    description: 'Corte clásico con lavado incluido',
    category: 'peluquería',
    duration: 30,
    price: 4500,
    available: true,
  },
  {
    name: 'Coloración',
    description: 'Tinte completo con matizado',
    category: 'peluquería',
    duration: 90,
    price: 12000,
    available: true,
  },
  {
    name: 'Manicura',
    description: 'Manicura tradicional y esmaltado',
    category: 'estética',
    duration: 45,
    price: 6000,
    available: true,
  },
  {
    name: 'Masaje relajante',
    description: 'Masaje de 60 minutos con aceites',
    category: 'bienestar',
    duration: 60,
    price: 15000,
    available: false,
  },
];

await connectDB();

const count = await Service.countDocuments();
if (count > 0) {
  console.log(`Ya hay ${count} servicios en la base, no se modifica nada.`);
} else {
  await Service.insertMany(samples);
  console.log(`${samples.length} servicios de ejemplo creados.`);
}

process.exit(0);
