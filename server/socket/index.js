module.exports = (io) => {
  const chat = io.of(`/chat/channels/`);

  chat.on('connection', (socket) => {
    socket.on('join', (channel) => {
      socket.join(channel);
    });

    socket.on('new-message', (message) => {
      chat.emit('new-message', message.newMessage);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
