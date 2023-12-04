const express = require('express');
const { Calendar } = require('../models/calendar'); // Import your calendar event model
const router = express.Router();
const mongoose = require('mongoose');

// Create a new calendar event
router.post('/', async (req, res) => {
  const { title, description, startDateTime, endDateTime, attendees, status , user, dateCreated, location } = req.body;
  const calendar = new Calendar({
    title,
    description,
    location,
    startDateTime,
    endDateTime,
    attendees,
    status,
    user: req.body.user,
    dateCreated,
  });
  try {
    const savedEvent = await calendar.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a list of calendar events
// router.get('/', async (req, res) => {
//   try {
//     const events = await Calendar.find();
//     res.status(200).json(events);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get(`/`, async (req, res) => {
  const events = await Calendar.find()
    .populate("user", "name")
    .sort({ dateCreated: -1 });

  if (!events) {
    res.status(500).json({ success: false });
  }
  res.send(events);
});

// Get a specific calendar event by ID
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Event Id');
  }

  try {
    const event = await Calendar.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a calendar event by ID
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Event Id');
    }

    // Find the event by ID
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Update event properties based on req.body
    event.title = req.body.title;
    event.description = req.body.description;
    event.location = req.body.location;
    event.startDateTime = req.body.startDateTime;
    event.endDateTime = req.body.endDateTime;
    event.attendees = req.body.attendees;
    event.status = req.body.status;

    // Save the updated event
    await event.save();

    res.json(event); // Return the updated event data
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// Delete a calendar event by ID
router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Event Id');
  }

  try {
    const event = await Calendar.findByIdAndRemove(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'The event is deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
