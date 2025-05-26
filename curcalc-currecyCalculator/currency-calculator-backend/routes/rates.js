const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); 

// loads in functions
const {
  getRates,
  createRate,
  updateRate,
  deleteRate
} = require("../controllers/rateController");

// (Reading database)
// fetching data from rates.json does not require logging in
router.get("/", getRates);

// (Writing to database)
// adding, updating and deleting rates requires a log in
router.post("/", auth, createRate);
router.put("/:id", auth, updateRate);
router.delete("/:id", auth, deleteRate);

module.exports = router;
