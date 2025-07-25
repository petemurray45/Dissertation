import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEnquiryConfirmation = async (to, name, propertyTitle) => {
  try {
    const email = await resend.emails.send({
      from: "Property App <onboarding@resend.dev>",
      to,
      subject: "Enquiry Confirmation",
      html: `<p>Hi ${name},</p>
            <p>Thanks for enquiring about <strong>${propertyTitle}</strong>.</p>
            <p>One of our agents will get back to you as soon as possible!</p>
            </br>
            <p>Warm regards,</br>The Property App Team</p>`,
    });
    console.log("Email sent successfully!", email);
  } catch (err) {
    console.log("Failed to send email.", err);
  }
};
