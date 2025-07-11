import Mailgen from "mailgen";

import { mailtrapTransporter } from "../config/mailtrapMailer.js";
import { resendTransporter } from "../config/resendMailer.js";
import { ApiError } from "./ApiError.js";
import { env } from "../config/env.js";

export const sendEmail = async ({ email, subject, mailGenContent }) => {
  const mailGenerator = new Mailgen({
    theme: "salted",
    product: {
      name: "PlanOcean",
      link: "https://planocean.com/",
      copyright: `Copyright © ${new Date().getFullYear()} PlanOcean. All rights reserved.`,
    },
  });

  const emailHTML = mailGenerator.generate(mailGenContent);
  const emailText = mailGenerator.generatePlaintext(mailGenContent);

  const env = env.NODE_ENV?.trim().toLowerCase();

  try {
    if (env === "development") {
      const info = await mailtrapTransporter.sendMail({
        from: env.SENDER_EMAIL,
        to: email,
        subject,
        text: emailText,
        html: emailHTML,
      });

      if (!info?.messageId) {
        console.error("Mailtrap failed:", info);
        throw new ApiError(400, "Failed to send email via Mailtrap", info);
      }
    } else {
      const response = await resendTransporter.emails.send({
        from: env.SENDER_EMAIL,
        to: email,
        subject,
        text: emailText,
        html: emailHTML,
      });

      if (!response || response.error) {
        console.error("Resend failed:", response?.error);
        throw new ApiError(400, "Failed to send email via Resend", response);
      }
    }

    console.log(`Email sent successfully  to ${email}`);
  } catch (error) {
    console.error("Error in sending email:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Unable to send email", error);
  }
};

export const emailVerificationMailGenContent = (fullname, verificationUrl) => ({
  body: {
    name: fullname,
    intro: "Welcome to PlanOcean! We're very excited to have you on board.",
    action: {
      instructions: "To get started, please verify your email:",
      button: {
        color: "#22BC66",
        text: "Verify your email",
        link: verificationUrl,
      },
    },
    outro: "Ignore! if you haven't created the account.",
  },
});

export const forgotPasswordMailGenContent = (fullname, forgotPasswordUrl) => ({
  body: {
    name: fullname,
    intro: "You recently requested to reset your password for your PlanOcean account.",
    action: {
      instructions: "Click the button below to reset your password:",
      button: {
        color: "#22BC66",
        text: "Reset Password",
        link: forgotPasswordUrl,
      },
    },
    outro:
      "If you did not request a password reset, no further action is required. This link will expire shortly for your security.",
  },
});
