// import { createTransport } from "nodemailer";

// export const sendMail = async (email, otp) => {
//   var transport = createTransport({
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   var mailOpts = {
//     from: "luminous.verify@gmail.com",
//     to: email,
//     subject: "Account Verification",
//     text: "Hi there! Your generated OTP is " + otp + ".",
//   };

//   await transport.sendMail(mailOpts, function (err, response) {
//     if (err) {
//       //ret.message = "Mail error.";
//       console.log("Error: ", err);
//     } else {
//       //ret.message = "Mail send.";
//       console.log("delivered");
//     }
//   });
// };

import sgMail from "@sendgrid/mail";

export const sendMail = async (email, otp) => {
    sgMail.setApiKey(process.env.SG_MAIL_API_KEY);
    const msg = {
        to: email, // Change to your recipient
        from: "luminous.verify@gmail.com", // Change to your verified sender
        subject: "Lumina OTP Verification",
        text: "Hi there! Your generated OTP is " + otp + ".",
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
};
