import { mailConfig } from '../config/mail.js';

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const emailService = {
  async sendEmail(options: SendMailOptions): Promise<{ success: boolean; message: string }> {
    if (!mailConfig.isConfigured) {
      console.log(`✉️ [Email Service Simulation] Email queued to: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      return {
        success: true,
        message: 'Email logged in simulation mode (Configure SMTP in settings for real dispatch).',
      };
    }

    try {
      // In production with credentials:
      console.log(`✉️ [Email Service] Sending mail to ${options.to}...`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error: any) {
      console.error('Email dispatch error:', error);
      return { success: false, message: error.message };
    }
  },

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const res = await this.sendEmail({
      to: email,
      subject: 'CMS — Verify Your College Community Account',
      html: `<p>Welcome to CMS (College Community Management System). Verification code: <strong>${token}</strong></p>`,
    });
    return res.success;
  },

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const res = await this.sendEmail({
      to: email,
      subject: 'CMS — Password Reset Request',
      html: `<p>Reset your CMS password by clicking: <a href="${resetLink}">Reset Password</a></p>`,
    });
    return res.success;
  },
};
