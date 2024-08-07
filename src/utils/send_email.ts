import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';

export const sendEmail = async (
  templatePath: string,
  data: any,
  mailOptions: nodemailer.SendMailOptions,
) => {
  return new Promise(function (resolve, reject) {
    const configSecure = {
      secure: true,
      requireTLS: true,
      port: 465,
      secured: true,
    };

    const smtpConfig = {
      host: process.env.MAIL_HOST,
      debug: true,
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport({
      ...configSecure,
      ...smtpConfig,
    });

    const file = fs.readFileSync(templatePath, 'utf-8');
    const tpl = Handlebars.compile(file);
    const emailHTML = tpl(data);
    mailOptions.html = emailHTML;

    const txt = convert(emailHTML, { wordwrap: 130 });
    mailOptions.text = txt;
    mailOptions.from = `${process.env.MAIL_SENDER_NAME} ${process.env.MAIL_SENDER}`;

    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.log('error from mailer', err);
        reject(err);
      } else {
        console.log('Email sent to ' + mailOptions.to);
        resolve('Email has been send');
      }
    });
  });
};
