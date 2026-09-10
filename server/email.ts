export async function sendPasswordResetEmail(toEmail: string, resetUrl: string): Promise<boolean> {
  try {
    console.log(`[MOCK EMAIL] Password reset email would be sent to: ${toEmail}`);
    console.log(`[MOCK EMAIL] Reset URL: ${resetUrl}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}
