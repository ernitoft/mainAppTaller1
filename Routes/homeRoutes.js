

const { Router } = require("express");
const router = Router();

router.get('/', (req, res)=> {
    return res.json({
        message: 'Taller 1 Iniciado - Main APP - Ernes Fuenzalida. Realizado en Express'
    });
});

module.exports = router;