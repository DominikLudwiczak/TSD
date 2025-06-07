import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { createUser } from '../api/users';
//import { createRoom } from '../api/rooms';
import { v4 as uuidv4 } from 'uuid';


const Home = ({ onJoin }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('roomId');
    if (fromUrl) setRoomId(fromUrl);
  }, []);

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
    if (!nickname) return;
    const finalRoomId = roomId || uuidv4();

  
    try {
      // 1. Utwórz użytkownika (lub pomiń jeśli już istnieje)
      const userRes = await axios.post(`${process.env.BACKEND_URL}/api/users`, {
      //const userRes = await createUser({
        username: nickname,
        displayName: nickname,
        role: 'developer',
        preferredDeckType: 'fibonacci'
      });
      const user = userRes.data;    //definiujemy user zanim go użyjemy
  
      // 2. Spróbuj utworzyć pokój – jeśli już istnieje, to kontynuuj
      try {
        await axios.post(`${process.env.BACKEND_URL}/api/rooms`, {
        //await createRoom({
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
  
  const handleGenerateInvite = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    const fullInviteLink = `${window.location.origin}?roomId=${newRoomId}`;
    setInviteLink(fullInviteLink);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link skopiowany do schowka!');
  };
  

/*  return (
    <div style={{ padding: '20px' }}>
      <h1>Dołącz do planowania</h1>
      <input placeholder="Nick" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input placeholder="ID pokoju" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={handleJoin}>Dołącz</button>
    </div>
  );*/

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dołącz do planowania</h1>
      <input
        placeholder="Nick"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        placeholder="ID pokoju (opcjonalne)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <button onClick={handleJoin} style={{ marginRight: '10px' }}>Dołącz</button>
      <button onClick={handleGenerateInvite}>Invite</button>

      {inviteLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Link do zaproszenia:</p>
          <input
            type="text"
            value={inviteLink}
            readOnly
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <button onClick={handleCopyInviteLink}>Skopiuj link</button>
        </div>
      )}
    </div>
  );
};

export default Home;
