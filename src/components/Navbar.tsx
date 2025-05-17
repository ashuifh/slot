import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Slot Selector
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;