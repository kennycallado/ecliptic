import nodemailer from "nodemailer";

const host = import.meta.env.SECRET_MAIL_HOST;
const port = import.meta.env.SECRET_MAIL_PORT;
const user = import.meta.env.SECRET_MAIL_USERNAME;
const pass = import.meta.env.SECRET_MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true, // true for port 465, false for other ports
  auth: { user, pass },
});

export { transporter };
