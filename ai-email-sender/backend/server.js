const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Generate email
app.post('/generate-email', async (req, res) => {
  const { prompt } = req.body;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const email = chatCompletion.choices[0].message.content;
    res.json({ email });
  } catch (error) {
    console.error('Groq API Error:', error.message);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

// Send email with debug logs
app.post('/send-email', async (req, res) => {
  const { recipients, subject, content } = req.body;
  console.log("Attempting to send email to:", recipients);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients.join(','),
      subject,
      text: content,
    });

    console.log("Email sent successfully");
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
