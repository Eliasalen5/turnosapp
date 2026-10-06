import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { hbs } from './config/hbs.config.js';
import apiRoutes from './routes/index.routes.js';
import viewsRoutes from './routes/views.routes.js';
import { notFound, errorHandler } from './middlewares/error.handler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);
app.use('/', viewsRoutes);

app.use(notFound);
app.use(errorHandler);
