const Room = require('../models/Room');

const createRoom = async (roomData) => {
  const room = new Room(roomData);
  return await room.save();
};

const getRoomById = async (roomId) => {
  return await Room.findById(roomId).populate('creator').populate('participants.user');
};

const addParticipant = async (roomId, userId) => {
  return await Room.findByIdAndUpdate(
    roomId,
    {
      $push: {
        participants: { user: userId }
      }
    },
    { new: true }
  );
};

const deactivateRoom = async (roomId) => {
  return await Room.findByIdAndUpdate(roomId, { isActive: false }, { new: true });
};

module.exports = {
  createRoom,
  getRoomById,
  addParticipant,
  deactivateRoom
};
