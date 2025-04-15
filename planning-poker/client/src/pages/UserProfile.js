import React, { useState } from 'react';

const UserProfile = ({ user, onUpdateUser }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [role, setRole] = useState(user.role || 'developer');
  const [deckType, setDeckType] = useState(user.preferredDeckType || 'fibonacci');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user data
      const updatedUser = {
        ...user,
        displayName,
        role,
        preferredDeckType: deckType
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in parent component
      onUpdateUser(updatedUser);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Profile updated successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-gray-700 font-medium mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="developer">Developer</option>
              <option value="observer">Observer</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="deckType" className="block text-gray-700 font-medium mb-2">
              Preferred Deck Type
            </label>
            <select
              id="deckType"
              value={deckType}
              onChange={(e) => setDeckType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fibonacci">Fibonacci (1, 2, 3, 5, 8, 13, ...)</option>
              <option value="tshirt">T-Shirt (XS, S, M, L, XL, ...)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Member Since</div>
            <div className="text-lg font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Rooms Created</div>
            <div className="text-lg font-medium">
              {user.statistics?.roomsCreated || 0}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Sessions Participated</div>
            <div className="text-lg font-medium">
              {user.statistics?.sessionsParticipated || 0}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Estimations Given</div>
            <div className="text-lg font-medium">
              {user.statistics?.estimationsGiven || 0}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Last Active</div>
            <div className="text-lg font-medium">
              {new Date(user.lastActive).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;