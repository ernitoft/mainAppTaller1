const { Router } = require("express");
const router = Router();

const { createRestrictions, deleteRestrictions} = require('../Controllers/restrictionsController');

router.post('/createRestriction', createRestrictions);
router.delete('/deleteRestriction', deleteRestrictions);

module.exports = router;
