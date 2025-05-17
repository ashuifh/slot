import React from 'react';
import { Clock, Calendar, MapPin, User } from 'lucide-react';
import { TimeSlot, SlotRequest } from '../types';

interface SlotCardProps {
  item: TimeSlot | SlotRequest;
  type: 'availability' | 'request';
  onAction?: (id: string, action?: string) => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ item, type, onAction }) => {
  const isRequest = type === 'request';
  const request = item as SlotRequest;
  const slot = item as TimeSlot;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-3">
        {/* Time */}
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {isRequest ? `${request.startTime} - ${request.endTime}` : `${slot.start} - ${slot.end}`}
          </span>
        </div>

        {/* Subject/Location */}
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{isRequest ? request.subject : slot.subject}</span>
          {!isRequest && slot.location && (
            <span className="ml-1 text-gray-400">({slot.location})</span>
          )}
        </div>

        {/* Teacher/Student Info */}
        <div className="flex items-center text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>
            {isRequest
              ? `${request.studentName} → ${request.teacherName}`
              : slot.teacher}
          </span>
        </div>

        {/* Status for requests */}
        {isRequest && request.status && (
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {onAction && (
          <div className="mt-4">
            {isRequest && request.status === 'pending' ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => onAction(request.id, 'accept')}
                  className="flex-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => onAction(request.id, 'reject')}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAction(slot.id)}
                className="w-full bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
              >
                Request Slot
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotCard;