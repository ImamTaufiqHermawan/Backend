const nodemailer = require("nodemailer");
const ApiError = require("../utils/apiError");

const sendEmail = async (data, next) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "'no-reply' <preducation@example.com>",
      to: `${data.to}`,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = sendEmail;
