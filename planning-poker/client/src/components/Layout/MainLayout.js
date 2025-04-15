import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children, user, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;