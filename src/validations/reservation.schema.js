import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de servicio inválido');

export const mongoIdSchema = z.object({
  rid: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido'),
});

export const reservationServiceParamSchema = z.object({
  rid: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido'),
  sid: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de servicio inválido'),
});

export const createReservationSchema = z.object({
  services: z
    .array(
      z.object({
        service: objectId,
        quantity: z.coerce.number().int().min(1, 'La cantidad mínima es 1'),
      })
    )
    .max(50, 'Una reserva puede tener hasta 50 servicios')
    .optional()
    .default([]),
});

export const addServiceSchema = z.object({
  service: objectId,
  quantity: z.coerce.number().int().min(1, 'La cantidad mínima es 1').optional().default(1),
});

export const updateQuantitySchema = z.object({
  quantity: z.coerce.number().int().min(1, 'La cantidad mínima es 1'),
});
