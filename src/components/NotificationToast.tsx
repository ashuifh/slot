import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 ${getToastStyles()} text-white px-4 py-2 rounded-lg shadow-lg flex items-center`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-white hover:text-gray-200 focus:outline-none"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default NotificationToast;