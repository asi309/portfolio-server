const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
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

app.get('/resume', (req, res) => {
  fs.readFile(path.join(__dirname, 'assets', 'resume.pdf'), (err, data) => {
    if (err) {
      return res.sendStatus(500);
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
