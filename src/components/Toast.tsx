import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white`}>
      <span>{message}</span>
      <button onClick={onClose} className="p-1">
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;