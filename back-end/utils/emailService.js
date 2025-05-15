const nodemailer = require('nodemailer');
const { FRONTEND_URL } = process.env;

/**
 * Email Service for sending notifications
 *
 * This service handles sending emails for various events:
 * - Vendor approval
 * - Payment completion
 * - New booking notifications
 */

// Create a transporter object
const createTransporter = () => {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise} - Promise with send info
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Wedding Planner" <noreply@weddingplanner.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    // For development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send vendor approval notification
 * @param {Object} vendor - Vendor data
 * @param {Object} vendor.user - User data
 * @param {string} vendor.user.email - Vendor email
 * @param {string} vendor.user.firstName - Vendor first name
 * @param {string} vendor.businessName - Vendor business name
 */
const sendVendorApprovalEmail = async (vendor) => {
  const subject = 'Your Vendor Account Has Been Approved!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4CAF50; text-align: center;">Congratulations!</h2>
      <p>Hello ${vendor.user.firstName},</p>
      <p>We're pleased to inform you that your vendor account <strong>${vendor.businessName}</strong> has been approved!</p>
      <p>You can now log in to your vendor dashboard and start managing your services, bookings, and payments.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/login" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Go to Vendor Dashboard
        </a>
      </div>
      <p>Thank you for joining our wedding planning platform. We look forward to a successful partnership!</p>
      <p>Best regards,<br>The Wedding Planner Team</p>
    </div>
  `;

  return sendEmail({
    to: vendor.user.email,
    subject,
    html,
  });
};

/**
 * Send payment completion notification to vendor
 * @param {Object} payment - Payment data
 * @param {Object} booking - Booking data
 * @param {Object} vendor - Vendor data
 */
const sendPaymentCompletionToVendor = async (payment, booking, vendor) => {
  const subject = 'Payment Received for Booking';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4CAF50; text-align: center;">Payment Received</h2>
      <p>Hello ${vendor.user.firstName},</p>
      <p>We're pleased to inform you that a payment has been completed for a booking:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Service:</strong> ${booking.service.name}</p>
        <p><strong>Client:</strong> ${booking.client.user.firstName} ${booking.client.user.lastName}</p>
        <p><strong>Amount:</strong> ETB ${payment.amount.toLocaleString()}</p>
        <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
        <p><strong>Payment ID:</strong> ${payment.id}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/dashboard/bookings/${booking.id}/show" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Booking Details
        </a>
      </div>
      <p>Please review the booking details and confirm it at your earliest convenience.</p>
      <p>Best regards,<br>The Wedding Planner Team</p>
    </div>
  `;

  return sendEmail({
    to: vendor.user.email,
    subject,
    html,
  });
};

/**
 * Send new booking notification to vendor
 * @param {Object} booking - Booking data
 * @param {Object} vendor - Vendor data
 */
const sendNewBookingToVendor = async (booking, vendor) => {
  const subject = 'New Booking Received';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4CAF50; text-align: center;">New Booking Received</h2>
      <p>Hello ${vendor.user.firstName},</p>
      <p>You have received a new booking for your service:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Service:</strong> ${booking.service.name}</p>
        <p><strong>Client:</strong> ${booking.client.user.firstName} ${booking.client.user.lastName}</p>
        <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/dashboard/bookings/${booking.id}/show" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Booking Details
        </a>
      </div>
      <p>Please review the booking details and confirm it at your earliest convenience.</p>
      <p>Best regards,<br>The Wedding Planner Team</p>
    </div>
  `;

  return sendEmail({
    to: vendor.user.email,
    subject,
    html,
  });
};

/**
 * Send booking confirmation notification to client
 * @param {Object} booking - Booking data
 * @param {Object} client - Client data
 */
const sendBookingConfirmationToClient = async (booking, client) => {
  const subject = 'Your Booking Has Been Confirmed!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4CAF50; text-align: center;">Booking Confirmed</h2>
      <p>Hello ${client.user.firstName},</p>
      <p>We're pleased to inform you that your booking has been confirmed by the vendor:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Service:</strong> ${booking.service.name}</p>
        <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${booking.location}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/dashboard/my-bookings" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Booking Details
        </a>
      </div>
      <p>If you have any questions, please contact the vendor directly.</p>
      <p>Best regards,<br>The Wedding Planner Team</p>
    </div>
  `;

  return sendEmail({
    to: client.user.email,
    subject,
    html,
  });
};

/**
 * Send booking cancellation notification to client
 * @param {Object} booking - Booking data
 * @param {Object} client - Client data
 * @param {string} cancellationReason - Reason for cancellation
 */
const sendBookingCancellationToClient = async (booking, client, cancellationReason) => {
  const subject = 'Your Booking Has Been Cancelled';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #F44336; text-align: center;">Booking Cancelled</h2>
      <p>Hello ${client.user.firstName},</p>
      <p>We regret to inform you that your booking has been cancelled by the vendor:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Service:</strong> ${booking.service.name}</p>
        <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
        <p><strong>Cancellation Reason:</strong> ${cancellationReason}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/dashboard/my-bookings" style="background-color: #F44336; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Booking Details
        </a>
      </div>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>The Wedding Planner Team</p>
    </div>
  `;

  return sendEmail({
    to: client.user.email,
    subject,
    html,
  });
};

/**
 * Send booking completion notification to client
 * @param {Object} booking - Booking data
 * @param {Object} client - Client data
 */
const sendBookingCompletionToClient = async (booking, client) => {
  const subject = 'Your Booking Has Been Completed';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4CAF50; text-align: center;">Booking Completed</h2>
      <p>Hello ${client.user.firstName},</p>
      <p>We're pleased to inform you that your booking has been marked as completed by the vendor:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Service:</strong> ${booking.service.name}</p>
        <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/dashboard/my-bookings" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Booking Details
        </a>
      </div>
      <p>Thank you for using our platform. We hope you had a great experience!</p>
      <p>Best regards,<br>The Wedding Planner Team</p>
    </div>
  `;

  return sendEmail({
    to: client.user.email,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
  sendVendorApprovalEmail,
  sendPaymentCompletionToVendor,
  sendNewBookingToVendor,
  sendBookingConfirmationToClient,
  sendBookingCancellationToClient,
  sendBookingCompletionToClient,
};
