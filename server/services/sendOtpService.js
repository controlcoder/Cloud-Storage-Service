import OTP from "../models/otpModel.js";

// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);
// export async function sendOtpService(email) {
//   const otp = Math.floor(1000 + Math.random() * 9000).toString();
//   await OTP.findOneAndUpdate(
//     { email },
//     { otp, createdAt: new Date() },
//     { upsert: true },
//   );
//   const html = `
//     <div style="font-family:sans-serif;">
//       <h2>Your OTP is: ${otp}</h2>
//       <p>This OTP is valid for 10 minutes.</p>
//     </div>
//   `;
//   await resend.emails.send({
//     from: "Storage App <otp@storageApp.dev>",
//     to: email,
//     subject: "Storage App OTP",
//     html,
//   });
//   return { success: true, message: `OTP sent successfully on ${email}` };
// }

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

export async function sendOtpService(email) {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Upsert OTP (replace if it already exists)
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true },
    );

    const html = `
      <div style="font-family:sans-serif;">
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    console.log("before sending otp");

    const info = await transporter.sendMail({
      from: "Storage App <otp@storageApp.dev>",
      to: email,
      subject: "Storage App OTP",
      html,
    });

    console.log("after sending otp");

    return { success: true, message: `OTP sent successfully on ${email}` };
  } catch (error) {
    console.log("otp not sent, something went wrong", error);
    return { success: false };
  }
}
