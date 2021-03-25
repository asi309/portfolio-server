const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');

const Project = require('./models/Project');

const app = express();

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

try {
  mongoose.connect(process.env.MONGO_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('DB connected successfully');
} catch (error) {
  console.log(error);
}

app.use(cors());
app.use(express.json());

app.post('/submit', (req, res) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send();
  }

  const content = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

  const mail = {
    from: email,
    to: process.env.EMAIL,
    subject: 'PORTFOLIO: New message',
    text: content,
  };

  transport.sendMail(mail, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to send message',
      });
    }

    return res.status(200).json({
      message: 'Message sent successfully!!!',
    });
  });

  transport.close();
});

app.get('/projects', async (req, res) => {
  const projects = await Project.find({});

  if (projects.length === 0) {
    return res.status(200).json({
      message: 'Nothing to show here',
    });
  }

  return res.status(200).json({
    message: 'Found!',
    projects,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
