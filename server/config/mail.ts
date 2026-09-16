// Email Configuration stub using Nodemailer specification
export const mailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASSWORD || '',
  collegeDomain: process.env.COLLEGE_EMAIL_DOMAIN || 'college.edu',
  isConfigured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
};

export const getMailStatus = () => ({
  configured: mailConfig.isConfigured,
  host: mailConfig.host,
  collegeDomain: mailConfig.collegeDomain,
});
