import { Resend } from "resend";

const resendTransporter = new Resend(process.env.RESEND_API_KEY);

export { resendTransporter };
