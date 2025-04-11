// server/models/Card.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  value: {
    type: String,
    required: true,
    trim: true
  },
  displayValue: {
    type: String,
    required: true,
    trim: true
  },
  sortOrder: {
    type: Number,
    required: true
  },
  deckType: {
    type: String,
    enum: ['fibonacci', 'tshirt', 'custom'],
    default: 'fibonacci'
  },
  // Dodanie pola dla specjalnych kart jak "coffee break" czy "?"
  isSpecial: {
    type: Boolean,
    default: false
  }
});

// Indeks dla efektywniejszego wyszukiwania
cardSchema.index({ deckType: 1, sortOrder: 1 });

module.exports = mongoose.model('Card', cardSchema);