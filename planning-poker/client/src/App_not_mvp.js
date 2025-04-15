// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { SocketProvider } from './contexts/SocketContext';
// import Header from './components/Layout/Header';
// import Footer from './components/Layout/Footer';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import RoomPage from './pages/RoomPage';
// import CreateRoomPage from './pages/CreateRoomPage';
// import SessionPage from './pages/SessionPage';
// import UserProfile from './pages/UserProfile';
// import NotFound from './pages/NotFound';
// import './App.css';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user exists in localStorage
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const handleLogin = (userData) => {
//     // Set the user in localStorage
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   // Simple Auth Guard component
//   const ProtectedRoute = ({ children }) => {
//     if (loading) return <div>Loading...</div>;
//     if (!user) return <Navigate to="/login" />;
//     return children;
//   };

//   return (
//     <SocketProvider>
//       <Router>
//         <div className="App flex flex-col min-h-screen">
//           <Header user={user} onLogout={handleLogout} />
          
//           <main className="flex-grow">
//             <Routes>
//               {/* Public routes */}
//               <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
              
//               {/* Protected routes */}
//               <Route path="/" element={
//                 <ProtectedRoute>
//                   <Home user={user} />
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/create-room" element={
//                 <ProtectedRoute>
//                   <CreateRoomPage user={user} />
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/rooms/:roomId" element={
//                 <ProtectedRoute>
//                   <RoomPage user={user} />
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/sessions/:sessionId" element={
//                 <ProtectedRoute>
//                   <SessionPage user={user} />
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/profile" element={
//                 <ProtectedRoute>
//                   <UserProfile user={user} onUpdateUser={setUser} />
//                 </ProtectedRoute>
//               } />
              
//               {/* 404 Not Found */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </main>
          
//           <Footer />
//         </div>
//       </Router>
//     </SocketProvider>
//   );
// }

// export default App;