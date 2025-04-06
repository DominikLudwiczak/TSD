// server/scripts/seed.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Room = require('../models/Room');
const Card = require('../models/Card');
const EstimationSession = require('../models/EstimationSession');

// Dane testowe dla użytkowników
const users = [
  {
    username: 'developer1',
    displayName: 'John Developer',
    role: 'developer'
  },
  {
    username: 'developer2',
    displayName: 'Jane Developer',
    role: 'developer'
  },
  {
    username: 'moderator1',
    displayName: 'Team Lead',
    role: 'moderator'
  }
];

// Dane testowe dla kart w talii Fibonacci
const fibonacciCards = [
  { value: '0', displayValue: '0', sortOrder: 1, deckType: 'fibonacci' },
  { value: '1', displayValue: '1', sortOrder: 2, deckType: 'fibonacci' },
  { value: '2', displayValue: '2', sortOrder: 3, deckType: 'fibonacci' },
  { value: '3', displayValue: '3', sortOrder: 4, deckType: 'fibonacci' },
  { value: '5', displayValue: '5', sortOrder: 5, deckType: 'fibonacci' },
  { value: '8', displayValue: '8', sortOrder: 6, deckType: 'fibonacci' },
  { value: '13', displayValue: '13', sortOrder: 7, deckType: 'fibonacci' },
  { value: '21', displayValue: '21', sortOrder: 8, deckType: 'fibonacci' },
  { value: '?', displayValue: '?', sortOrder: 9, deckType: 'fibonacci' },
  { value: 'coffee', displayValue: '☕', sortOrder: 10, deckType: 'fibonacci' }
];

// Funkcja do czyszczenia i ponownego zasilania bazy danych
const seedDatabase = async () => {
  try {
    // Połącz z bazą danych
    await connectDB();
    
    // Wyczyść istniejące dane
    await User.deleteMany({});
    await Room.deleteMany({});
    await Card.deleteMany({});
    await EstimationSession.deleteMany({});
    
    console.log('Database cleared');
    
    // Dodaj użytkowników
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Dodaj karty
    const createdCards = await Card.insertMany(fibonacciCards);
    console.log(`${createdCards.length} cards created`);
    
    // Utwórz pokój testowy
    const room = await Room.create({
      name: 'Test Planning Room',
      description: 'A room for testing the planning poker app',
      creator: createdUsers[2]._id, // moderator jako twórca
      participants: [
        { user: createdUsers[0]._id },
        { user: createdUsers[1]._id },
        { user: createdUsers[2]._id }
      ]
    });
    
    console.log(`Test room created with ID: ${room._id}`);
    
    // Utwórz sesję estymacji
    const estimationSession = await EstimationSession.create({
      room: room._id,
      taskName: 'Sample Task',
      taskDescription: 'This is a sample task for estimation',
      estimations: [
        {
          user: createdUsers[0]._id,
          card: createdCards[2]._id // wartość '2'
        },
        {
          user: createdUsers[1]._id,
          card: createdCards[3]._id // wartość '3'
        }
      ],
      status: 'active'
    });
    
    console.log(`Test estimation session created with ID: ${estimationSession._id}`);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Uruchom seedowanie
seedDatabase();