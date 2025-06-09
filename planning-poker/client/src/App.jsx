import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import RoomJoin from './components/RoomJoin';
import PlanningRoom from './pages/PlanningRoom';
import { SocketProvider } from './context/SocketContext';

function App() {
  const [authUser, setAuthUser] = useState(null); // Zalogowany użytkownik JWT
  const [roomUser, setRoomUser] = useState(null); // Użytkownik w pokoju
  const [showAuth, setShowAuth] = useState(true); // Pokaż formularz logowania
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sprawdź czy użytkownik jest już zalogowany
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthUser(user);
        setShowAuth(false);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleAuthSuccess = (user, token) => {
    if (user && token) {
      // Pełne logowanie JWT
      setAuthUser(user);
      setShowAuth(false);
    } else {
      // Przejście do starego systemu
      setShowAuth(false);
    }
  };

  const handleRoomJoin = (userInfo) => {
    setRoomUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
    setRoomUser(null);
    setShowAuth(true);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Ładowanie...</div>;
  }

  return (
    <SocketProvider>
      {showAuth ? (
        // Ekran logowania/rejestracji
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : !roomUser ? (
        // Ekran dołączania do pokoju
        <div>
          <div style={{ 
            textAlign: 'right', 
            padding: '10px',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#f8f9fa'
          }}>
            {authUser ? (
              <div>
                Zalogowany: <strong>{authUser.displayName || authUser.username}</strong>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    marginLeft: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                style={{ 
                  padding: '5px 10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Zaloguj się
              </button>
            )}
          </div>
          <RoomJoin onJoin={handleRoomJoin} currentUser={authUser} />
        </div>
      ) : (
        // Główna aplikacja planning poker
        <div>
          <div style={{ 
            textAlign: 'right', 
            padding: '10px',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#f8f9fa'
          }}>
            {authUser ? (
              <div>
                Zalogowany: <strong>{authUser.displayName || authUser.username}</strong>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    marginLeft: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <div>
                Szybki dostęp: <strong>{roomUser.nickname}</strong>
                <button 
                  onClick={() => setRoomUser(null)}
                  style={{ 
                    marginLeft: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Zmień pokój
                </button>
              </div>
            )}
          </div>
          <PlanningRoom user={roomUser} />
        </div>
      )}
    </SocketProvider>
  );
}

export default App;