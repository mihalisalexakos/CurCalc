const express = require("express");
const router = express.Router();
const { convert } = require("../controllers/convertController");

router.post("/", convert);

module.exports = router;
