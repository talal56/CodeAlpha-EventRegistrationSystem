const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


router.post('/events', async (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  if (!title || !description || !date || !location || !capacity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newEvent = new Event({ title, description, date, location, capacity });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});


router.get('/events', async (req, res) => {
  try {
    
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/events/:id/count', async (req, res) => {
  try {
    const Registration = require('../models/Registration'); // imported here to avoid circular require issues
    const count = await Registration.countDocuments({ eventId: req.params.id });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;