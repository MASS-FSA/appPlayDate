module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(socket.id, ' Welcome to the party!');

    socket.on('new-message', (message) => {
      socket.broadcast.emit('new-message', message);
    });

    socket.on('new-channel', (channel) => {
      socket.broadcast.emit('new-channel', channel);
    });
  });
};
