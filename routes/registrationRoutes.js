const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');


router.post('/events/:id/register', async (req, res) => {
  const { name, email } = req.body;
  const eventId = req.params.id;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const currentCount = await Registration.countDocuments({ eventId });
    if (currentCount >= event.capacity) {
      return res.status(400).json({ error: 'This event is fully booked' });
    }

    const alreadyRegistered = await Registration.findOne({ eventId, email });
    if (alreadyRegistered) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }

    const registration = new Registration({ eventId, name, email });
    await registration.save();

    res.status(201).json(registration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});


router.get('/registrations/:email', async (req, res) => {
  try {
    const registrations = await Registration.find({ email: req.params.email })
      .populate('eventId'); 
  

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/registrations/:id', async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;