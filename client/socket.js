import io from 'socket.io-client';
import chat from './store';
import { gotMessage } from './store/chat';

const socket = io(`/chat/channels/`);

socket.on('connect', (channel) => {
  socket.emit('join', channel);
});

socket.on('new-message', async (newMessage) => {
  try {
    await chat.dispatch(gotMessage(newMessage));
  } catch (error) {
    console.error(error);
  }
});

export default socket;
