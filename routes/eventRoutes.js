const express = require("express");
const router = express.Router();

// TEST ROUTE FIRST
router.get("/", (req, res) => {
  res.json({ message: "GET Events Working" });
});

// CREATE EVENT
router.post("/", (req, res) => {
  res.json({ message: "POST Events Working" });
});

router.delete("/:id", (req, res) => {
  const eventId = req.params.id;

  res.json({
    message: "Event deleted successfully",
    id: eventId
  });
});

module.exports = router;

module.exports = router;