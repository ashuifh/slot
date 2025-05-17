import axios from 'axios';
import { API_URL } from './constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTimetableTeachers = async () => {
  const response = await api.get('/timetable/teachers');
  return response.data;
};

export const getStudentRequests = async () => {
  const response = await api.get('/slots/student/requests');
  return response.data;
};

export const requestSlot = async (
  slotId: string,
  teacherId: string,
  day: string,
  startTime: string,
  endTime: string
) => {
  const response = await api.post('/slots/request-slot', {
    slotId,
    teacherId,
    day,
    startTime,
    endTime
  });
  return response.data;
};