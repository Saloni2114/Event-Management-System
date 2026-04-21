const express = require("express");
const router = express.Router();
const { registerForEvent, getMyEvents } = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", protect, registerForEvent);
router.get("/my-events", protect, getMyEvents);

module.exports = router;
