"use server";

import {ContactData} from "@/types/types";
import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(data: ContactData) {
  try {
    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.email.trim() ||
      !data.message.trim()
    ) {
      throw new Error("Please fill in all required fields.");
    }
    const {error} = await resend.emails.send({
      from: "T&T Group <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: data.email,
      subject: `New contact message from ${data.firstName} ${data.lastName}`,
      text: `Name: ${data.firstName} ${data.lastName} Email: ${data.email} Phone: ${data.phone || "Not provided"} Message: ${data.message}`
    });

    if (error) {
      throw new Error("Message could not be sent.");
    }

    return {success: true};
  } catch {
    return {success: false, error: "Something went wrong. Please try again."};
  }
}
