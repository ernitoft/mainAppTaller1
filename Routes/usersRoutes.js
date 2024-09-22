const { Router } = require("express");
const router = Router();
const {createStudent} = require('../Controllers/usersController.js')

router.post('/createStudent', createStudent)

module.exports = router;