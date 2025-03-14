const express = require('express');
const { getDentists } = require('../controllers/dentists');

const router = express.Router();

router.route('/').get(getDentists);

module.exports = router;