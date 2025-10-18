import nodemailer from 'nodemailer'

interface EmailOptions {
    name: string;
    email: string;
    subject: string;
    message: string;
    link?: string;
}


export const sendMail = async ({ name, email, subject, message, link }: EmailOptions):Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    let htmlContent = "";
    switch (subject) {
        case "Verify Your Email":
            htmlContent = `
            <h2 style="color: #007bff; text-align: center;">Verify Your Email</h2>
                <p style="font-size: 16px; color: #333;"><strong>Hello ${name || 'User'},</strong></p>
                <p style="font-size: 16px; color: #333;">Please verify your email address by clicking the link below:</p>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 14px;">
                <a href="${link}" style="color: #007bff; text-decoration: none;">${link}</a>
                </p>
                <p style="font-size: 16px; color: #555;">This link may expire soon. Please act quickly.</p>
            `;
            break;
        // case "Reset Your Password":
        //     htmlContent = `<h2 style="color: #007bff; text-align: center;">Reset Your Password</h2>
        //             <p style="font-size: 16px; color: #333;"><strong>Hello ${name || 'User'},</strong></p>
        //             <p style="font-size: 16px; color: #333;">We received a request to reset your password.</p>
        //             <p style="font-size: 16px; color: #333;">Click the link below to reset your password:</p>
        //             <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 14px; color: #444;">
        //                 <a href="${link}" style="color: #007bff; text-decoration: none;">Reset Password</a>
        //             </p>
        //             <p style="font-size: 16px; color: #555;">This link will expire in 30 minutes.</p>`;
        //     break
        case "Reset Your Password":
            htmlContent = `<h2 style="color: #007bff; text-align: center;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #333;"><strong>Hello ${name || 'User'},</strong></p>
                    <p style="font-size: 16px; color: #333;">We received a request to reset your password.</p>
                    <p style="font-size: 16px; color: #333;">Here is the OTP:</p>
                    <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 18px; color: #444;">
                          ${link}
                    </p>
                    <p style="font-size: 16px; color: #555;">This link will expire in 30 minutes.</p>`;
            break
        case "custom":
        default:
            htmlContent = `
            <h2 style="color: #007bff; text-align: center;">${subject}</h2>
            <p style="font-size: 16px; color: #333;"><strong>Hello ${name || 'User'},</strong></p>
            <p style="font-size: 16px; color: #333;">${message}</p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 14px;">
            <a href="${link}" style="color: #007bff; text-decoration: none;">${link}</a>
            </p>`;
        break;
    }
    const fullHtml = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px;">
                ${htmlContent}
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="text-align: center; color: #888; font-size: 14px;">
                Best Regards,<br><strong>Assent-AI</strong>
                </p>
            </div>
            </body>
            </html>`;

    const mailOption = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: fullHtml
    }
    await transporter.sendMail(mailOption);
}