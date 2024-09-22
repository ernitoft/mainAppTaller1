const { Router } = require("express");
const router = Router();

const { login } = require("../Controllers/authController");

router.post( '/login',login);

module.exports = router;