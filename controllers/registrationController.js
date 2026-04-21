const Registration = require("../models/Registration");
const Event = require("../models/Event");

// @desc    Register for an event
// @route   POST /api/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's registered events
// @route   GET /api/my-events
// @access  Private
exports.getMyEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({
        path: "event",
        populate: {
          path: "createdBy",
          select: "name email"
        }
      });
    
    const events = registrations.map(reg => reg.event);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
