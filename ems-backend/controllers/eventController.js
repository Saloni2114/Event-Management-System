const Event = require("../models/Event");
const mongoose = require("mongoose");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL EVENTS
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE EVENT
exports.getEventById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("registrations", "name");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REGISTER FOR EVENT
exports.registerEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = event.registrations.some(
      (userId) => userId.toString() === req.user.id
    );

    if (!alreadyRegistered) {
      event.registrations.push(req.user.id);
      await event.save();
    }

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};