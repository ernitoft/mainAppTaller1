const { Router } = require("express");
const router = Router();

const { listSearchByGrade } = require("../Controllers/searchController");

router.get("/", listSearchByGrade);

module.exports = router;
