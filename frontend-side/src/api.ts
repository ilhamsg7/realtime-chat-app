import axios from 'axios';

axios.defaults.withCredentials = true;

export const getChatRooms = () => {
  return axios.get('http://localhost:3000/api/chat_rooms');
};

export const getMessages = (roomId: number) => {
  return axios.get(`http://localhost:3000/api/chat_rooms/${roomId}/messages`);
};

export const postMessage = (roomId: number, content: string) => {
  return axios.post(`http://localhost:3000/api/chat_rooms/${roomId}/messages`, {
    message: { content }
  });
};