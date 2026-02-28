import nodemailer from 'nodemailer';

// Email templates
const emailTemplates = {
  welcome: (name: string, loginUrl: string) => `
    <h1>Welcome to Ocean Insight!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for registering with Ocean Insight. We're excited to have you as part of our ocean education community.</p>
    <p><a href="${loginUrl}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a></p>
    <p>Happy learning!<br>The Ocean Insight Team</p>
  `,

  passwordReset: (resetLink: string) => `
    <h1>Reset Your Password</h1>
    <p>We received a request to reset your password. Click the link below to reset it.</p>
    <p><a href="${resetLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,

  collectionShared: (sharedBy: string, collectionName: string, viewLink: string) => `
    <h1>${sharedBy} shared a collection with you!</h1>
    <p><strong>${collectionName}</strong> has been shared with you.</p>
    <p><a href="${viewLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Collection</a></p>
  `,

  eventReminder: (eventName: string, eventDate: string, eventLink: string) => `
    <h1>Upcoming Event: ${eventName}</h1>
    <p>You have an upcoming event on ${eventDate}.</p>
    <p><a href="${eventLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Event Details</a></p>
  `,
};

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize transporter with SMTP configuration
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  async sendWelcomeEmail(email: string, name: string, loginUrl: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || 'no-reply@oceaninsight.com',
        to: email,
        subject: 'Welcome to Ocean Insight!',
        html: emailTemplates.welcome(name, loginUrl),
      });
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || 'no-reply@oceaninsight.com',
        to: email,
        subject: 'Reset Your Ocean Insight Password',
        html: emailTemplates.passwordReset(resetLink),
      });
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  async sendCollectionSharedEmail(
    email: string,
    sharedBy: string,
    collectionName: string,
    viewLink: string
  ): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || 'no-reply@oceaninsight.com',
        to: email,
        subject: `${sharedBy} shared a collection with you`,
        html: emailTemplates.collectionShared(sharedBy, collectionName, viewLink),
      });
      return true;
    } catch (error) {
      console.error('Failed to send collection shared email:', error);
      return false;
    }
  }

  async sendEventReminderEmail(
    email: string,
    eventName: string,
    eventDate: string,
    eventLink: string
  ): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || 'no-reply@oceaninsight.com',
        to: email,
        subject: `Reminder: ${eventName}`,
        html: emailTemplates.eventReminder(eventName, eventDate, eventLink),
      });
      return true;
    } catch (error) {
      console.error('Failed to send event reminder email:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default new EmailService();