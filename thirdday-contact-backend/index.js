const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  const { name, email, category, priority, copy, human, message } = req.body;

  // Optional: block spam
  if (!human) {
    return res.status(400).json({ message: 'Bot detected. Submission blocked.' });
  }

  // Email setup (Gmail example)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,     // your Gmail
      pass: process.env.EMAIL_PASS      // app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO || process.env.EMAIL_FROM, // send to yourself
    subject: `New Inquiry from ${name} [${category}]`,
    text: `
Name: ${name}
Email: ${email}
Category: ${category}
Priority: ${priority}
Copy Requested: ${copy ? "Yes" : "No"}

Message:
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

