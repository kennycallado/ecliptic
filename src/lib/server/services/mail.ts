import nodemailer from "nodemailer";
import { MAIL } from "$lib/server/consts.ts";

const transporter = nodemailer.createTransport({
  secure: true, // true for port 465, false for other ports
  ...MAIL,
});

export { transporter };
