const { Router } = require("express");
const router = Router();

const { login } = require("../Controllers/authController");

router.post( '/login',login);
router.get('/', (req, res)=> {
    res.send('Taller 1 Iniciado');
})

module.exports = router;