import { createTransport } from "nodemailer";

export const sendMail = async (email, otp) => {
  var transport = createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  var mailOpts = {
    from: "devhickerydickery@outlook.com",
    to: email,
    subject: "Account Verification",
    text: "Hi there! Your generated OTP is " + otp + ".",
  };

  await transport.sendMail(mailOpts, function (err, response) {
    if (err) {
      //ret.message = "Mail error.";
      console.log("Error: ", err);
    } else {
      //ret.message = "Mail send.";
      console.log("delivered");
    }
  });
};
