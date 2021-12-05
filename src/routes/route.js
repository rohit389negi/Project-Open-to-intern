const express = require('express');
const router = express.Router();

const collegeController = require ('../controllers/collegeController')
const internController = require ('../controllers/internController')


router.post('/colleges', collegeController.createCollege)
router.post('/interns', internController.registerIntern)

module.exports = router;