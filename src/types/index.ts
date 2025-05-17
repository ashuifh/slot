export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  subject: string;
  location: string;
  group: string;
  teacher: string;
}

export interface SlotRequest {
  id: string;
  slotId: string;
  studentId: string;
  teacherId: string;
  studentName: string;
  teacherName: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}