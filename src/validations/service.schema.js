import { z } from 'zod';

export const mongoIdSchema = z.object({
  sid: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido'),
});

export const createServiceSchema = z.object({
  name: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  description: z.string().trim().max(500, 'La descripción no puede superar 500 caracteres').optional().default(''),
  category: z.string().trim().max(50, 'La categoría no puede superar 50 caracteres').optional().default('general'),
  duration: z.coerce
    .number({ error: 'La duración debe ser numérica' })
    .int('La duración debe ser entera')
    .min(1, 'La duración mínima es 1 minuto')
    .max(1440, 'La duración no puede superar 1440 minutos')
    .optional()
    .default(30),
  price: z.coerce
    .number({ error: 'El precio debe ser numérico' })
    .min(0, 'El precio no puede ser negativo')
    .optional()
    .default(0),
  available: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((value) => value === true || value === 'true')
    .optional()
    .default(true),
});

export const updateServiceSchema = z.object({
  name: z.string().trim().min(1, 'El nombre no puede estar vacío').max(100, 'El nombre no puede superar 100 caracteres').optional(),
  description: z.string().trim().max(500, 'La descripción no puede superar 500 caracteres').optional(),
  category: z.string().trim().max(50, 'La categoría no puede superar 50 caracteres').optional(),
  duration: z.coerce
    .number({ error: 'La duración debe ser numérica' })
    .int('La duración debe ser entera')
    .min(1, 'La duración mínima es 1 minuto')
    .max(1440, 'La duración no puede superar 1440 minutos')
    .optional(),
  price: z.coerce
    .number({ error: 'El precio debe ser numérico' })
    .min(0, 'El precio no puede ser negativo')
    .optional(),
  available: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((value) => value === true || value === 'true')
    .optional(),
});

export const listServicesQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  available: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sort: z.enum(['name', 'price', 'duration', 'createdAt', 'updatedAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});
