import io from 'socket.io-client';
import chat from './store';
import { gotMessage } from './store/chat';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('You made it to the party!');
});

socket.on('new-message', (message) => {
  chat.dispatch(gotMessage(message));
});

export default socket;
