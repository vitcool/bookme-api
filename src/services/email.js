/* eslint-disable no-console */
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  static sendWelcomeEmail(email, name) {
    try {
      sgMail.send({
        to: email,
        from: 'vitalikulyk@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Hello, ${name}! We are happy to see you there! Welcome to the app!`,
      });
    } catch (e) {
      console.warn(`EmailService.sendWelcomeEmail - ${e.message}`);
    }
  }
}

module.exports = EmailService;
