import { create } from 'express-handlebars';

export const hbs = create({
  defaultLayout: 'main',
  extname: '.handlebars',
  helpers: {
    formatCurrency: (value) =>
      new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value ?? 0),
    formatDate: (value) =>
      value ? new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '-',
    shortId: (value) => String(value).slice(-6),
    totalQuantity: (items) =>
      Array.isArray(items) ? items.reduce((acc, item) => acc + item.quantity, 0) : 0,
  },
});
