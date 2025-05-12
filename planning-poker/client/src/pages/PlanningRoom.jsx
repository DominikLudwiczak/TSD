import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useSocket } from '../context/SocketContext';
import JiraImportExport from '../components/JiraImportExport';

const cards = [0, 1, 2, 3, 5, 8, 13, 21];

const PlanningRoom = ({ user }) => {
  const socket = useSocket();
  const [selectedCard, setSelectedCard] = useState(null);
  const [allVotes, setAllVotes] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [userMap, setUserMap] = useState({}); // userId => nickname
  const [userStories, setUserStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const [sessionId, setSessionId] = useState('session-1'); // Domyślny ID sesji - w rzeczywistości powinno to być pobierane z API

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
    socket.on('card-reset-ack', (userId) => {
      setAllVotes((prev) => prev.filter((v) => v.userId !== userId));
    });

    // Ujawnienie
    socket.on('cards-revealed', () => {
      setShowCards(true);
    });

    // Nasłuchuj aktualizacji historii użytkownika
    socket.on('user-stories-updated', (stories) => {
      setUserStories(stories);
    });

    // Nasłuchuj wyboru historii użytkownika
    socket.on('current-story-selected', (story) => {
      setCurrentStory(story);
      resetEstimation(); // Resetuj estymację gdy zmienia się historia
    });

    // Pobierz istniejące historie użytkownika przy ładowaniu
    fetchUserStories();

    return () => {
      socket.off('user-joined');
      socket.off('card-selected');
      socket.off('card-reset-ack');
      socket.off('cards-revealed');
      socket.off('user-stories-updated');
      socket.off('current-story-selected');
    };
  }, [socket, user, userMap]);

  // Funkcja do pobierania istniejących historii użytkownika
  const fetchUserStories = async () => {
    try {
      // Tutaj powinno być pobieranie z API
      // const response = await fetch(`/api/sessions/${sessionId}/stories`);
      // const data = await response.json();
      // setUserStories(data);
      
      // Tymczasowo używamy pustej tablicy jako placeholder
      setUserStories([]);
    } catch (error) {
      console.error('Error fetching user stories:', error);
    }
  };

  const handleSelect = (card) => {
    setSelectedCard(card);
    socket.emit('select-card', user.roomId, user.nickname, card);
    
    // Jeśli mamy wybraną historię, zapisz również estymację dla tej historii
    if (currentStory) {
      saveEstimation(currentStory.id, card);
    }
  };

  // Reset tylko własnego wyboru
  const handleReset = () => {
    setSelectedCard(null);
    setShowCards(false);
    setAllVotes((prev) => prev.filter((v) => v.userId !== user.nickname));
    socket.emit('card-reset', user.roomId, user.nickname);
  };

  const handleReveal = () => {
    socket.emit('reveal-cards', user.roomId, sessionId);
    
    // Jeśli mamy wybraną historię, zapisz finalną estymację dla tej historii
    if (currentStory && allVoted) {
      finalizeFinalEstimation();
    }
  };

  // Resetuje estymację dla wszystkich
  const resetEstimation = () => {
    setSelectedCard(null);
    setShowCards(false);
    setAllVotes([]);
    socket.emit('reset-all-cards', user.roomId, sessionId);
  };

  // Zapisz pojedynczą estymację dla historii
  const saveEstimation = async (storyId, estimation) => {
    try {
      // Tutaj powinno być zapisywanie w API
      // await fetch(`/api/stories/${storyId}/estimation`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user.nickname, estimation })
      // });
      console.log(`Zapisano estymację ${estimation} dla historii ${storyId}`);
    } catch (error) {
      console.error('Error saving estimation:', error);
    }
  };

  // Zapisz finalną estymację na podstawie wszystkich głosów
  const finalizeFinalEstimation = async () => {
    if (!currentStory || !allVoted) return;
    
    // Oblicz finalną estymację (średnia, mediana lub inna logika)
    const estimations = allVotes.map(v => v.card);
    const finalEstimation = Math.round(
      estimations.reduce((sum, val) => sum + val, 0) / estimations.length
    );
    
    try {
      // Tutaj powinno być zapisywanie w API
      // await fetch(`/api/stories/${currentStory.id}/final-estimation`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ finalEstimation })
      // });
      console.log(`Zapisano finalną estymację ${finalEstimation} dla historii ${currentStory.id}`);
      
      // Aktualizuj lokalny stan
      setUserStories(prev => 
        prev.map(story => 
          story.id === currentStory.id 
            ? { ...story, finalEstimation } 
            : story
        )
      );
    } catch (error) {
      console.error('Error saving final estimation:', error);
    }
  };

  const handleSelectStory = (story) => {
    setCurrentStory(story);
    socket.emit('select-current-story', user.roomId, story);
  };

  // Handler dla udanego importu historii z JIRA
  const handleImportSuccess = (importedStories) => {
    setUserStories(prev => [...prev, ...importedStories]);
    socket.emit('update-user-stories', user.roomId, [...userStories, ...importedStories]);
  };

  const hasVoted = (nickname) =>
    allVotes.some((v) => v.userId === nickname);

  const everyone = [...new Set([...participants, user.nickname])];

  const allVoted = everyone.length > 0 &&
    everyone.every((nickname) =>
      allVotes.some((v) => v.userId === nickname)
    );

  const isCreator = true; // Tutaj powinna być prawdziwa logika sprawdzania czy użytkownik jest twórcą sesji

  return (
    <div style={{ padding: '20px' }}>
      <h2>Użytkownik: {user.nickname} | Pokój: {user.roomId}</h2>
      
      {/* Komponent importu/eksportu JIRA - tylko dla twórcy sesji */}
      {isCreator && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <JiraImportExport 
            sessionId={sessionId} 
            onImportSuccess={handleImportSuccess} 
          />
        </div>
      )}

      {/* Sekcja wyboru historii użytkownika */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Historie użytkownika:</h3>
        {userStories.length === 0 ? (
          <p>Brak historii użytkownika. {isCreator ? 'Zaimportuj historie z JIRA lub dodaj ręcznie.' : 'Poczekaj, aż twórca sesji zaimportuje historie.'}</p>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
            {userStories.map((story, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '8px', 
                  margin: '5px 0', 
                  cursor: 'pointer',
                  backgroundColor: currentStory?.id === story.id ? '#f0f0f0' : 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                onClick={() => handleSelectStory(story)}
              >
                <div style={{ fontWeight: 'bold' }}>{story.title}</div>
                <div style={{ fontSize: '0.9em' }}>{story.description}</div>
                {story.finalEstimation && (
                  <div style={{ color: 'green' }}>Estymacja: {story.finalEstimation}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sekcja bieżącej historii */}
      {currentStory && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h3>Aktualna historia:</h3>
          <div style={{ fontWeight: 'bold' }}>{currentStory.title}</div>
          <div>{currentStory.description}</div>
        </div>
      )}
  
      {/* Sekcja kart planowania */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Wybierz kartę:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
          {cards.map((c) => (
            <Card key={c} value={c} onSelect={handleSelect} isSelected={selectedCard === c} />
          ))}
        </div>
      </div>
  
      {/* Przyciski akcji */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleReset} 
          style={{ marginRight: '10px' }}
        >
          Resetuj mój wybór
        </button>
        
        {isCreator && (
          <button 
            onClick={resetEstimation} 
            style={{ marginRight: '10px' }}
          >
            Resetuj dla wszystkich
          </button>
        )}
        
        <button 
          onClick={handleReveal} 
          disabled={!allVoted || !currentStory}
        >
          Pokaż karty
        </button>
        
        {!allVoted && (
          <p style={{ color: 'gray', marginTop: '5px' }}>
            Poczekaj, aż wszyscy zagłosują.
          </p>
        )}
        
        {!currentStory && (
          <p style={{ color: 'gray', marginTop: '5px' }}>
            Wybierz historię do estymacji.
          </p>
        )}
      </div>
  
      {/* Sekcja uczestników */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Uczestnicy:</h3>
        <ul>
          {everyone
            .filter((p) => p !== user.nickname) // usuń bieżącego użytkownika
            .sort((a, b) => a.localeCompare(b))
            .map((p, i) => (
              <li key={i}>
                {p} – {hasVoted(p) ? '🟢 zagłosował' : '🔴 nie zagłosował'}
              </li>
            ))}
        </ul>
      </div>
  
      {/* Sekcja wyników */}
      {showCards && (
        <div>
          <h3>Wyniki:</h3>
          <ul>
            {allVotes
              .sort((a, b) =>
                (userMap[a.userId] || a.userId).localeCompare(userMap[b.userId] || b.userId)
              )
              .map((v, i) => (
                <li key={i}>
                  {userMap[v.userId] || v.userId}: {v.card}
                </li>
              ))}
          </ul>
          
          {allVoted && (
            <div style={{ marginTop: '10px' }}>
              <strong>Średnia estymacja: </strong>
              {Math.round(
                allVotes.map(v => v.card).reduce((sum, val) => sum + val, 0) / allVotes.length
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
  
export default PlanningRoom;