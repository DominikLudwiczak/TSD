import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Planning Poker
          </Link>
        </div>

        <nav>
          <ul className="flex items-center space-x-6">
            {user ? (
              <>
                <li>
                  <Link 
                    to="/" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Rooms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/create-room" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Create Room
                  </Link>
                </li>
                <li className="relative group">
                  <button className="flex items-center text-gray-300 hover:text-white">
                    <span>{user.displayName || user.username}</span>
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/login" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;