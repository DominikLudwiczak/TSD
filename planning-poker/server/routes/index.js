const express = require('express');
const router = express.Router();

router.use('/cards', require('./cards'));
router.use('/users', require('./users'));
router.use('/rooms', require('./rooms'));
router.use('/sessions', require('./sessions'));

module.exports = router;
