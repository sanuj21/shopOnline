const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Anuj Sharma <mailtoanuj21@gmail.com>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the email
  async send(template, subject) {
    //1) Render HTML based on Pug
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );
    //2) Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // Create transport and sent email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendAccountConfirmation() {
    await this.send('accountConfirmation', 'Email Confirmation');
  }

  async sendResetToken() {
    await this.send('resetPassword', 'Reset Your Password');
  }

  async sendOrderConfirmation() {
    await this.send('orderConfirmation', 'Order Confirmation');
  }

  async sendOrderCancellation() {
    await this.send('orderCancellation', 'Order Cancelled');
  }
};
