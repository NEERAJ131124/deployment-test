const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.SendMail = async (to, subject, otp) => {
  try {
    // Read and process the HTML template
    let emailTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "otp_login.html"),
      "utf-8"
    );

    // Replace the OTP placeholder
    emailTemplate = emailTemplate.replace("{{otp}}", otp);

    await transporter.sendMail({
      from: `"Cold Storage" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: emailTemplate,
      attachments: [
        {
          filename: "logo1.png",
          path: path.join(__dirname, "templates", "logo1.png"),
          cid: "logo", // Matches the `cid:logo` in the HTML
        },
      ],
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

exports.SendContactMail = async ({ to, subject, name, query }) => {
  try {
    // Read and process the HTML template
    let emailTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "contact_us.html"),
      "utf-8"
    );

    // Replace the placeholders
    emailTemplate = emailTemplate.replace("{{Name}}", name);
    emailTemplate = emailTemplate.replace("{{Query}}", query);

    await transporter.sendMail({
      from: `"Book My Cold Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: emailTemplate,
      attachments: [
        {
          filename: "logo1.png",
          path: path.join(__dirname, "templates", "logo1.png"),
          cid: "logo", // Matches the `cid:logo` in the HTML
        },
      ],
    });

    console.log(`Contact email sent to ${to}`);
  } catch (error) {
    console.error("Error sending contact email:", error.message);
    throw error;
  }
};
