import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import CardDeck from './components/CardDeck';
import './App.css';

function App() {
  const handleCardSelect = (card) => {
    console.log('Selected card:', card);
  };

  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Planning Poker</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={
                <div>
                  <CardDeck deckType="fibonacci" onSelectCard={handleCardSelect} />
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;