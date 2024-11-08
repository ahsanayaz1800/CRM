const nodeMailer = require('nodemailer');
const smtpHost = process.env.SMTP_HOST; // smtp.gmail.com
const smtpPort = process.env.SMTP_PORT; // 587
const smtpSecure = process.env.SMTP_SECURE; // false
const smtpRequireTLS = process.env.SMTP_REQUIRE_TLS; // true
const smtpAuthUser = process.env.SMTP_AUTH_USER; // your email
const smtpAuthPass = process.env.SMTP_AUTH_PASS; // your password or app password

const transporter = nodeMailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure === 'true', // convert to boolean
    requireTLS: smtpRequireTLS === 'true', // convert to boolean
    auth: {
        user: smtpAuthUser,
        pass: smtpAuthPass
    }
});

module.exports = transporter;
