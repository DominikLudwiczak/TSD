import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllRooms } from '../services/roomService';
import Loading from '../components/Layout/Loading';
import Error from '../components/Layout/Error';

const Home = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getAllRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        setError('Failed to load rooms. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getAllRooms()
      .then(data => setRooms(data))
      .catch(err => {
        console.error(err);
        setError('Failed to load rooms. Please try again later.');
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <Loading message="Loading rooms..." />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Planning Poker Rooms</h1>
        <Link 
          to="/create-room" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create New Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Rooms Available</h2>
          <p className="text-gray-600 mb-6">
            There are no active planning poker rooms. Start by creating your own room!
          </p>
          <Link 
            to="/create-room" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-block"
          >
            Create Room
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{room.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {room.participants.length} participants
                  </span>
                  <span className="text-sm text-gray-500">
                    {room.deckType}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t">
                <Link 
                  to={`/rooms/${room._id}`} 
                  className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                  Join Room
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;