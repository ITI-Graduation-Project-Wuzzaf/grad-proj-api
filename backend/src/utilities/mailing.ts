import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import { contactTemplate, paymentTemplate } from './mail-templates/mails';
dotenv.config();

const { MAILING_USER, MAILING_PW, FROM_EMAIL } = process.env;

// NOTE  remember to pass options to the function for email and content
const mail = (reciever: string, subject: string, sender?: string, name?: string, msg?: string) => {
  // HERE  create SMTP service to be able to send mails
  const transporter = createTransport({
    service: 'hotmail',
    auth: {
      user: MAILING_USER,
      pass: MAILING_PW,
    },
  });

  const message = {
    from: `Jobify <${FROM_EMAIL}>`,
    to: reciever,
    subject: subject,
    text: 'For clients with plaintext support only',
    html: sender ? contactTemplate(sender, name, msg) : paymentTemplate(),
  };

  transporter.sendMail(message, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mail sent');
    }
  });
};

export default mail;
