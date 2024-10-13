const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://siva:1234@cluster0.6tlrylk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  registeredStudents: [{ name: String, email: String }]
});

const Event = mongoose.model('Event', eventSchema);

// Get all events
app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Create a new event (admin)
app.post('/event', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

// Register a user for an event
app.post('/event/:id/register', async (req, res) => {
  const event = await Event.findById(req.params.id);
  event.registeredStudents.push(req.body);
  await event.save();
  res.json(event);
});

// Get registered students for an event
app.get('/event/:id/students', async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event.registeredStudents);
});

// Server listens on port 5000
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
