// Email templates
const verificationEmailTemplate = (name: string, verificationLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0B0C0F; color: #C8FF2E; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; }
    .button { display: inline-block; background: #C8FF2E; color: #0B0C0F; padding: 12px 30px; 
              text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LoopFreight-FMS</h1>
    </div>
    <div class="content">
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for signing up with LoopFreight-FMS. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
      <a href="${verificationLink}" class="button">Verify Email Address</a>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${verificationLink}</p>
      <p>This link will expire in 24 hours for security reasons.</p>
    </div>
    <div class="footer">
      <p>© 2026 LoopFreight-FMS. All rights reserved.</p>
      <p>If you didn't sign up for this account, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;

const welcomeEmailTemplate = (name: string, dashboardLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0B0C0F; color: #C8FF2E; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; }
    .button { display: inline-block; background: #C8FF2E; color: #0B0C0F; padding: 12px 30px; 
              text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LoopFreight-FMS</h1>
    </div>
    <div class="content">
      <h2>Your account is verified!</h2>
      <p>Hi ${name},</p>
      <p>Your email has been successfully verified. You can now access your LoopFreight-FMS dashboard and start tracking your assets.</p>
      <a href="${dashboardLink}" class="button">Go to Dashboard</a>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Add your tracking devices</li>
        <li>Set up geofences for your assets</li>
        <li>Configure alert preferences</li>
        <li>Invite team members</li>
      </ul>
    </div>
    <div class="footer">
      <p>© 2026 LoopFreight-FMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const alertEmailTemplate = (title: string, message: string, details: Record<string, string>) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0B0C0F; color: #C8FF2E; padding: 20px; text-align: center; }
    .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LoopFreight-FMS Alert</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <h2>${title}</h2>
        <p>${message}</p>
      </div>
      <h3>Details:</h3>
      <ul>
        ${Object.entries(details).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
      </ul>
    </div>
    <div class="footer">
      <p>© 2026 LoopFreight-FMS. All rights reserved.</p>
      <p>You received this because you have alerts enabled in your notification settings.</p>
    </div>
  </div>
</body>
</html>
`;

const subscriptionExpiryTemplate = (name: string, trackerName: string, daysRemaining: number, renewLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0B0C0F; color: #C8FF2E; padding: 20px; text-align: center; }
    .warning-box { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .button { display: inline-block; background: #C8FF2E; color: #0B0C0F; padding: 12px 30px; 
              text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LoopFreight-FMS</h1>
    </div>
    <div class="content">
      <div class="warning-box">
        <h2>Subscription Expiring Soon</h2>
        <p>Your subscription for <strong>${trackerName}</strong> expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.</p>
      </div>
      <p>Hi ${name},</p>
      <p>To avoid service interruption and ensure continuous tracking of your asset, please renew your subscription before it expires.</p>
      <a href="${renewLink}" class="button">Renew Subscription</a>
      <p><strong>Note:</strong> After expiration, you will still be able to see if your asset is active, but the map will be blurred until you renew.</p>
    </div>
    <div class="footer">
      <p>© 2026 LoopFreight-FMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Email service functions - Resend is lazy-loaded only in production
export const emailService = {
  // Send verification email
  async sendVerificationEmail(to: string, name: string, token: string): Promise<boolean> {
    try {
      // In development, just log the email
      if (import.meta.env.DEV) {
        console.log('📧 Verification Email:', { to, name, token });
        return true;
      }

      // In production, dynamically import resend
      const { Resend } = await import('resend');
      const resend = new Resend('re_MewdrNA4_9umeh4MMS4JfboERRR1ZmKd3');
      const verificationLink = `${window.location.origin}/verify-email?token=${token}`;
      
      const { error } = await resend.emails.send({
        from: 'LoopFreight-FMS <noreply@loopfreight.io>',
        to,
        subject: 'Verify your email address - LoopFreight-FMS',
        html: verificationEmailTemplate(name, verificationLink),
      });

      if (error) {
        console.error('Failed to send verification email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  },

  // Send welcome email
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    try {
      if (import.meta.env.DEV) {
        console.log('📧 Welcome Email:', { to, name });
        return true;
      }

      const { Resend } = await import('resend');
      const resend = new Resend('re_MewdrNA4_9umeh4MMS4JfboERRR1ZmKd3');
      const dashboardLink = `${window.location.origin}/dashboard`;
      
      const { error } = await resend.emails.send({
        from: 'LoopFreight-FMS <noreply@loopfreight.io>',
        to,
        subject: 'Welcome to LoopFreight-FMS!',
        html: welcomeEmailTemplate(name, dashboardLink),
      });

      if (error) {
        console.error('Failed to send welcome email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  },

  // Send alert email
  async sendAlertEmail(
    to: string, 
    title: string, 
    message: string, 
    details: Record<string, string>
  ): Promise<boolean> {
    try {
      if (import.meta.env.DEV) {
        console.log('📧 Alert Email:', { to, title, message, details });
        return true;
      }

      const { Resend } = await import('resend');
      const resend = new Resend('re_MewdrNA4_9umeh4MMS4JfboERRR1ZmKd3');

      const { error } = await resend.emails.send({
        from: 'LoopFreight-FMS Alerts <alerts@loopfreight.io>',
        to,
        subject: `Alert: ${title}`,
        html: alertEmailTemplate(title, message, details),
      });

      if (error) {
        console.error('Failed to send alert email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending alert email:', error);
      return false;
    }
  },

  // Send subscription expiry reminder
  async sendSubscriptionExpiryEmail(
    to: string,
    name: string,
    trackerName: string,
    daysRemaining: number
  ): Promise<boolean> {
    try {
      if (import.meta.env.DEV) {
        console.log('📧 Subscription Expiry Email:', { to, name, trackerName, daysRemaining });
        return true;
      }

      const { Resend } = await import('resend');
      const resend = new Resend('re_MewdrNA4_9umeh4MMS4JfboERRR1ZmKd3');
      const renewLink = `${window.location.origin}/subscription/renew`;
      
      const { error } = await resend.emails.send({
        from: 'LoopFreight-FMS <noreply@loopfreight.io>',
        to,
        subject: `Subscription Expiring in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} - ${trackerName}`,
        html: subscriptionExpiryTemplate(name, trackerName, daysRemaining, renewLink),
      });

      if (error) {
        console.error('Failed to send subscription expiry email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending subscription expiry email:', error);
      return false;
    }
  },
};

export default emailService;
