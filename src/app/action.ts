'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(/^\d{10}$/, {
    message: 'Please enter a valid 10-digit phone number.',
  }),
  message: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters.',
    })
    .optional()
    .or(z.literal('')),
});

type Result<T> = { success: true; data: T } | { success: false; error: string };

async function sendEmail(
  data: z.infer<typeof formSchema>
): Promise<Result<void>> {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return {
      success: false,
      error: 'Email configuration is missing',
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: 'New Contact Form Submission',
    text: `
      New contact form submission:

      Name: ${data.name}
      Email: ${data.email}
      Telephone: ${data.phone}
      Message: ${data.message}
    `,
  };

  const result = await transporter.sendMail(mailOptions).then(
    () => ({ success: true as const, data: undefined }),
    (error: Error) => ({
      success: false as const,
      error: error.message || 'Failed to send email',
    })
  );

  return result;
}

export const submitContact = actionClient
  .schema(formSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput) {
      return { success: false, error: 'Invalid input data' };
    }

    const result = await sendEmail(parsedInput);

    if (!result.success) {
      console.error('Error submitting contact form:', result.error);
      return {
        success: false,
        error: 'Failed to submit contact form. Please try again.',
      };
    }

    return { success: true, data: undefined };
  });
