const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendDueReminder = async (userEmail, bookTitle, dueDate) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Book Due Reminder',
      html: `
        <h2>Book Due Reminder</h2>
        <p>Your book "${bookTitle}" is due on ${new Date(dueDate).toLocaleDateString()}.</p>
        <p>Please return it to avoid any late fees.</p>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = {
  sendDueReminder
}; 