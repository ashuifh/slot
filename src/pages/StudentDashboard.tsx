import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Your student dashboard content will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;