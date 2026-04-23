const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  registerEvent
} = require("../controllers/eventController");

const auth = require("../middleware/authMiddleware");

// public
router.get("/", getEvents);
router.get("/:id", getEventById);

// protected
router.post("/", auth, createEvent);
router.post("/:id/register", auth, registerEvent);

module.exports = router;