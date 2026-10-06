import { Server } from 'socket.io';

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io no fue inicializado');
  }
  return io;
}
