//nodemailer and Brevo configuration
//after this create a file named .env in backend folder and add SMTP_USER and SMTP_PASS
// variables with the values provided by Brevo
//To use this transporter in any file, just import it using require and use transporter.sendMail() method.
const nodemailer=require('nodemailer')
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
module.exports = transporter ;



