import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendPasswordResetEmail(toEmail: string, resetUrl: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const result = await client.emails.send({
      from: fromEmail || 'HK Borah <noreply@resend.dev>',
      to: toEmail,
      subject: 'Reset Your Password - HK Borah',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: Georgia, 'Times New Roman', serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td style="padding: 40px; text-align: center; border-bottom: 1px solid #334155;">
                      <h1 style="color: #f59e0b; margin: 0; font-size: 28px; font-weight: normal;">HK Borah</h1>
                      <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Startup Architecture & Scaling</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #e2e8f0; margin: 0 0 20px; font-size: 22px; font-weight: normal;">Password Reset Request</h2>
                      <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 24px;">
                        We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
                      </p>
                      <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                        <tr>
                          <td style="background-color: #f59e0b; border-radius: 8px;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; color: #0f172a; text-decoration: none; font-weight: bold; font-size: 16px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
                        If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
                      </p>
                      <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 24px 0 0; padding-top: 20px; border-top: 1px solid #334155;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 40px; background-color: #0f172a; text-align: center;">
                      <p style="color: #64748b; font-size: 12px; margin: 0;">
                        &copy; ${new Date().getFullYear()} HK Borah. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });
    
    console.log('Password reset email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}
