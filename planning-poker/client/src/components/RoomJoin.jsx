import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const RoomJoin = ({ onJoin, currentUser }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('roomId');
    if (fromUrl) setRoomId(fromUrl);

    // Jeśli użytkownik jest zalogowany, użyj jego nazwy
    if (currentUser) {
      setNickname(currentUser.username);
    }
  }, [currentUser]);

  const handleJoin = async () => {
    if (!nickname) return;
    const finalRoomId = roomId || uuidv4();

    try {
      let user;
      
      if (currentUser) {
        // Użytkownik jest zalogowany przez JWT
        user = currentUser;
      } else {
        // Stary system - utwórz temporary użytkownika
        const userRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
          username: nickname,
          displayName: nickname,
          role: 'developer',
          preferredDeckType: 'fibonacci'
        });
        user = userRes.data;
      }

      // Spróbuj utworzyć pokój
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rooms`, {
          name: finalRoomId,
          creator: user._id
        });
      } catch (roomErr) {
        if (roomErr.response?.status !== 400) throw roomErr;
        console.warn('Pokój już istnieje – dołączamy do istniejącego.');
      }

      // Dołącz do pokoju
      onJoin({
        _id: user._id,
        nickname: user.username,
        roomId: finalRoomId,
        isAuthenticated: !!currentUser
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

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Dołącz do planowania</h1>
      
      {currentUser && (
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '20px'
        }}>
          <strong>Zalogowany jako:</strong> {currentUser.displayName || currentUser.username}
          <br />
          <small>Email: {currentUser.email}</small>
        </div>
      )}

      <input
        placeholder={currentUser ? currentUser.username : "Nick"}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        disabled={!!currentUser}
        style={{ 
          display: 'block', 
          marginBottom: '10px',
          width: '100%',
          padding: '8px',
          backgroundColor: currentUser ? '#f8f9fa' : 'white'
        }}
      />
      
      <input
        placeholder="ID pokoju (opcjonalne)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ 
          display: 'block', 
          marginBottom: '10px',
          width: '100%',
          padding: '8px'
        }}
      />
      
      <button onClick={handleJoin} style={{ marginRight: '10px' }}>
        Dołącz
      </button>
      <button onClick={handleGenerateInvite}>
        Invite
      </button>

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

export default RoomJoin;
