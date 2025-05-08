import React, { useState } from 'react';
import Home from './pages/Home';
import PlanningRoom from './pages/PlanningRoom';
import { SocketProvider } from './context/SocketContext'; // <- UPEWNIJ SIĘ, że ścieżka się zgadza

function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <SocketProvider>
      {!userInfo ? (
        <Home onJoin={setUserInfo} />
      ) : (
        <PlanningRoom user={userInfo} />
      )}
    </SocketProvider>
  );
}

export default App;
