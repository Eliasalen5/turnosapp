import http from 'http';
import { app } from './app.js';
import { config } from './config/env.config.js';
import { connectDB } from './config/db.config.js';
import { initSocket } from './config/socket.config.js';

const server = http.createServer(app);

initSocket(server);

await connectDB();

server.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port}`);
});
