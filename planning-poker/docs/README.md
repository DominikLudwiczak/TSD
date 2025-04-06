# Planning Poker

An application for task estimation using the Planning Poker method, enabling development teams to conduct remote planning sessions.

## Team Members
- Dominik Ludwiczak
- Dominika Plewińska
- Katarzyna Piechowiak
- Inżynier Marcin Wincenty Krzysztof Stecewicz

## Features

### MVP (Sprint 1)
- Viewing the card deck
- Selecting a card from the deck
- Displaying selected cards of all developers after making a choice
- Resetting the estimation
- Support for Chrome 99+ browser

## Technologies

### Frontend
- React 18+
- Socket.io-client (real-time communication)
- Axios (HTTP requests)
- React Router (navigation)

### Backend
- Node.js with Express
- Socket.io (real-time communication)
- Mongoose (ODM for MongoDB)

### Database
- MongoDB

### Tools
- Jest + React Testing Library (tests)
- GitHub Actions (CI/CD)
- ESLint + Prettier (code formatting)

## Development Requirements

### Tools
- Node.js (v18+)
- npm (v8+)
- MongoDB (v5+)
- Git

## Project Setup

### Cloning the Repository
```bash
git clone https://github.com/your-repo/planning-poker.git
cd planning-poker
```

### Frontend Setup
```bash
cd client
npm install
```

### Backend Setup
```bash
cd server
npm install
```

### Database Configuration
1. Make sure MongoDB is installed and running on your computer
2. Create an `.env` file in the `server` folder with the following content:
```
MONGODB_URI=mongodb://localhost:27017/planning-poker
PORT=5000
```

### Seeding Test Data
```bash
cd server
npm run seed
```

## Running the Project in Development Mode

### Backend
```bash
cd server
npm run dev
```
The server will be available at: http://localhost:5000

### Frontend
```bash
cd client
npm start
```
The application will be available at: http://localhost:3000

## Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## Branch Structure
- `main` - production branch, contains stable code ready for deployment
- `develop` - development branch, contains code for testing
- New features should be developed in `feature/feature-name` branches
- Bug fixes should be developed in `bugfix/bug-name` branches

## Deployment Process
1. Code is automatically built and tested with each push to the repository
2. After accepting a pull request to the `main` branch, the code is automatically deployed to the production environment
3. Deployment can also be triggered manually from the GitHub Actions panel

## Coding Conventions
- We use ESLint with Airbnb configuration
- Code formatting with Prettier
- React components in functional format using hooks
- Working with data through React context or state management library (to be decided)
