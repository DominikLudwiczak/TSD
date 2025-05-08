import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useSocket } from '../context/SocketContext';

const cards = [0, 1, 2, 3, 5, 8, 13, 21];

const PlanningRoom = ({ user }) => {
  const socket = useSocket();
  const [selectedCard, setSelectedCard] = useState(null);
  const [allVotes, setAllVotes] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [userMap, setUserMap] = useState({}); // userId => nickname

  useEffect(() => {
    // Dołączenie do pokoju
    socket.emit('join-room', user.roomId, user.nickname);

    // Nowy uczestnik dołącza
    socket.on('user-joined', (newNickname) => {
      setParticipants((prev) => (prev.includes(newNickname) ? prev : [...prev, newNickname]));
      setUserMap((prev) => ({ ...prev, [newNickname]: newNickname }));
    });

    // Głosowanie
    socket.on('card-selected', ({ userId, cardValue }) => {
      setAllVotes((prev) => {
        const updated = prev.filter((v) => v.userId !== userId);
        return [...updated, { userId, card: cardValue }];
      });

      // Dodaj mapowanie userId → nickname, jeśli nieznane
      if (!userMap[userId]) {
        setUserMap((prev) => ({ ...prev, [userId]: userId }));
      }
    });

    // Reset
    /*socket.on('estimation-reset', () => {
      setAllVotes([]);
      setSelectedCard(null);
      setShowCards(false);
    });*/
    socket.on('card-reset-ack', (userId) => {
      setAllVotes((prev) => prev.filter((v) => v.userId !== userId));
    });

    // Ujawnienie
    socket.on('cards-revealed', () => {
      setShowCards(true);
    });

    return () => {
      socket.off('user-joined');
      socket.off('card-selected');
      socket.off('card-reset-ack');
      //socket.off('estimation-reset');
      socket.off('cards-revealed');
    };
  }, [socket, user, userMap]);

  const handleSelect = (card) => {
    setSelectedCard(card);
    socket.emit('select-card', user.roomId, user.nickname, card);
  };

  /*const handleReset = () => {
    socket.emit('reset-estimation', user.roomId, 'session-1');
  };*/
  // Reset tylko własnego wyboru
  const handleReset = () => {
    setSelectedCard(null);
    setShowCards(false);
    setAllVotes((prev) => prev.filter((v) => v.userId !== user.nickname));
    socket.emit('card-reset', user.roomId, user.nickname);
  };

  const handleReveal = () => {
    socket.emit('reveal-cards', user.roomId, 'session-1');
  };

  const hasVoted = (nickname) =>
    allVotes.some((v) => v.userId === nickname);

  const everyone = [...new Set([...participants, user.nickname])];

  const allVoted = everyone.length > 0 &&
    everyone.every((nickname) =>
      allVotes.some((v) => v.userId === nickname)
    );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Użytkownik: {user.nickname} | Pokój: {user.roomId}</h2>
  
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
        {cards.map((c) => (
          <Card key={c} value={c} onSelect={handleSelect} isSelected={selectedCard === c} />
        ))}
      </div>
  
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleReveal} disabled={!allVoted}>
        Pokaż karty
      </button>
      {!allVoted && (
        <p style={{ color: 'gray', marginTop: '5px' }}>
          Poczekaj, aż wszyscy zagłosują.
        </p>
      )}
  
      <h3>Uczestnicy:</h3>
      <ul>
        {participants
          .filter((p) => p !== user.nickname) // usuń bieżącego użytkownika
          .sort((a, b) => a.localeCompare(b))
          .map((p, i) => (
            <li key={i}>
              {p} – {hasVoted(p) ? '🟢 zagłosował' : '🔴 nie zagłosował'}
            </li>
          ))}
      </ul>
  
      {showCards && (
        <>
          <h3>Wyniki:</h3>
          <ul>
            {allVotes
              .filter((v) => v.userId !== user.nickname)
              .sort((a, b) =>
                (userMap[a.userId] || a.userId).localeCompare(userMap[b.userId] || b.userId)
              )
              .map((v, i) => (
                <li key={i}>
                  {userMap[v.userId] || v.userId}: {v.card}
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};
  
export default PlanningRoom;