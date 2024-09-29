const { Router } = require("express");
const router = Router();

const { createRestrictions } = require('../Controllers/restrictionsController');

router.post('/createRestriction', createRestrictions);

module.exports = router;
