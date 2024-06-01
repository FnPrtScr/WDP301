const nodemailer = require('nodemailer');
const { errorResponse } = require('../utils/response');
const { json } = require('sequelize');
const { MAIL_TRANSPORT_HOST, MAIL_AUTH_USERNAME, MAIL_AUTH_PASSWORD } = process.env;

/**
 * @param {*} to receiver email
 * @param {*} subject subject email
 * @param {*} content content email send to user
 * @return send mail to specify user
 */
module.exports = async function sendEmail(to, subject, content) {
    const transporter = nodemailer.createTransport({
        host: MAIL_TRANSPORT_HOST,
        port: 465,
        secure: true,
        auth: {
            user: MAIL_AUTH_USERNAME,
            pass: MAIL_AUTH_PASSWORD,
        },
    });
    
    transporter.verify(function (error, success) {
        if (error) {
           return json( errorResponse(500, "can't create transport send mail"));
        }
    });

    const mailOptions = {
        from: MAIL_AUTH_USERNAME,
        to: to,
        subject: subject,
        text: content,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
