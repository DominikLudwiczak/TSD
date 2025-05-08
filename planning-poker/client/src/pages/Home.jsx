import React, { useState } from 'react';
import axios from 'axios';

const Home = ({ onJoin }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');

  /*const handleJoin = async () => {
    if (!nickname || !roomId) return;
    try {
      await axios.post('http://localhost:5000/api/users', { username: nickname });
      await axios.post('http://localhost:5000/api/rooms', { roomId });
      onJoin({ nickname, roomId });
    } catch (err) {
      console.error('Błąd z backendu:', err.response?.data || err.message);
      alert('Błąd: ' + (err.response?.data?.error || err.message));
    }
  };*/

  const handleJoin = async () => {
    if (!nickname || !roomId) return;
  
    try {
      // 1. Utwórz użytkownika (lub pomiń jeśli już istnieje)
      const userRes = await axios.post('http://localhost:5000/api/users', {
        username: nickname,
        displayName: nickname,
        role: 'developer',
        preferredDeckType: 'fibonacci'
      });
      const user = userRes.data;
  
      // 2. Spróbuj utworzyć pokój – jeśli już istnieje, to kontynuuj
      try {
        await axios.post('http://localhost:5000/api/rooms', {
          name: roomId,
          creator: user._id
        });
      } catch (roomErr) {
        if (roomErr.response?.status !== 400) throw roomErr;
        console.warn('Pokój już istnieje – dołączamy do istniejącego.');
      }
  
      // 3. Dołącz – przekazujemy dane do App
      onJoin({
        _id: user._id,
        nickname: user.username,
        roomId
      });
  
    } catch (err) {
      console.error('Błąd z backendu:', err.response?.data || err.message);
      alert('Błąd: ' + (err.response?.data?.error || err.message));
    }
  };
  
  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dołącz do planowania</h1>
      <input placeholder="Nick" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input placeholder="ID pokoju" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={handleJoin}>Dołącz</button>
    </div>
  );
};

export default Home;
