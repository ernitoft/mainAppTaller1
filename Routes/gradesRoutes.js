const { Router } = require("express");
const router = Router();

const { Assign } = require('../Controllers/gradesController');

router.post('/assign',Assign);

module.exports = router;
