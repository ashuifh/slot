import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Calendar } from 'lucide-react';
import SlotCard from '../components/SlotCard';
import NotificationToast from '../components/NotificationToast';
import Navbar from '../components/Navbar';
import { getTimetableTeachers, getStudentRequests, requestSlot } from '../utils/api';
import { addSocketListener, emitSlotRequest, removeSocketListener } from '../utils/socket';
import { DAYS, SOCKET_EVENTS } from '../utils/constants';
import { TimeSlot, SlotRequest } from '../types';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<string[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [myRequests, setMyRequests] = useState<SlotRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleRequestResponse = useCallback((data: { requestId: string; status: 'accepted' | 'rejected' }) => {
    setMyRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === data.requestId ? { ...req, status: data.status } : req
      )
    );
    setNotification({
      message: `Your request has been ${data.status}`,
      type: data.status === 'accepted' ? 'success' : 'info'
    });
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const teachersList = await getTimetableTeachers();
        setTeachers(teachersList);
        if (teachersList.length > 0) {
          setSelectedTeacher(teachersList[0]);
        }
        const requests = await getStudentRequests();
        setMyRequests(requests);
      } catch (error) {
        setNotification({
          message: 'Failed to load initial data',
          type: 'error'
        });
      }
    };

    loadInitialData();
    addSocketListener(SOCKET_EVENTS.REQUEST_RESPONSE, handleRequestResponse);

    return () => {
      removeSocketListener(SOCKET_EVENTS.REQUEST_RESPONSE, handleRequestResponse);
    };
  }, [handleRequestResponse]);

  const checkAvailability = async () => {
    if (!selectedTeacher || !selectedDay) {
      setNotification({
        message: 'Please select both a teacher and a day',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/timetable');
      const timetable = await response.json();
      const dayData = timetable.find((d: any) => d.day.toLowerCase() === selectedDay.toLowerCase());
      const slots = dayData ? dayData.slots.filter((slot: any) => slot.teacher === selectedTeacher) : [];
      setAvailableSlots(slots);
    } catch (error) {
      setNotification({
        message: 'Failed to load availability',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSlot = async (slotId: string) => {
    if (!user) return;

    const slot = availableSlots.find(s => s.id === slotId);
    if (!slot) return;

    try {
      const request = await requestSlot(
        slotId,
        selectedTeacher,
        selectedDay,
        slot.start,
        slot.end
      );

      emitSlotRequest({
        slotId,
        teacherId: selectedTeacher,
        studentId: user.id,
        day: selectedDay,
        startTime: slot.start,
        endTime: slot.end
      });

      setMyRequests([request, ...myRequests]);
      setNotification({
        message: 'Slot request sent successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to request slot',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Find Available Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="rounded-md border-gray-300"
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>

            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="rounded-md border-gray-300"
            >
              {DAYS.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <button
              onClick={checkAvailability}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Availability'}
            </button>
          </div>
        </div>

        {availableSlots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Available Slots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSlots.map(slot => (
                <SlotCard
                  key={slot.id}
                  item={slot}
                  type="availability"
                  onAction={handleRequestSlot}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-medium mb-4">My Requests</h2>
          {myRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No requests yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRequests.map(request => (
                <SlotCard
                  key={request.id}
                  item={request}
                  type="request"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;