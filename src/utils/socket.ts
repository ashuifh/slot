import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export const connectSocket = (userId: string, role: string) => {
  socket.emit('join', { userId, role });
};

export const emitSlotRequest = (data: {
  slotId: string;
  teacherId: string;
  studentId: string;
  day: string;
  startTime: string;
  endTime: string;
}) => {
  socket.emit('requestSlot', data);
};

export const addSocketListener = (event: string, callback: (data: any) => void) => {
  socket.on(event, callback);
};

export const removeSocketListener = (event: string, callback?: (data: any) => void) => {
  if (callback) {
    socket.off(event, callback);
  } else {
    socket.off(event);
  }
};