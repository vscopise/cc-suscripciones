'use server';

import nodemailer from 'nodemailer';

const user = process.env.GOOGLE_MAIL_APP_EMAIL;
const pass = process.env.GOOGLE_MAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
});

export async function sendMail(mailData: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}) {
    try {
        await transporter.sendMail(mailData);
        return true;
    } catch (error) {
        console.error("error sending email ", error)
        return false
    }
}
