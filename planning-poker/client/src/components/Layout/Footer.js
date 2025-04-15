import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-center py-4 text-white">
      <div className="container mx-auto px-4">
        <p>© {new Date().getFullYear()} Planning Poker App</p>
      </div>
    </footer>
  );
};

export default Footer;