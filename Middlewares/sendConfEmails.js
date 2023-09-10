const nodemailer = require('nodemailer');

// Configure your email transport using SMTP or other methods
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  service: 'Gmail',
  auth: {
    user: 'hathorcoworkingspace@gmail.com',
    pass: 'bopcwnqebllfthjr', // Use your Gmail account password or App password
  },
  tls: {
    rejectUnauthorized: false, // Disable SSL verification
  },
});

// Middleware function to send confirmation email
function sendConfirmationEmail(req, res, next) {
  const { email, booking_time, subject, id, booking_date, fullname, comments, phone } = req.body;

  const emailHTML = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de Réservation</title>
      <style>
          body {
              font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
          }
  
          .container {
              background-color: #fff;
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          h1 {
              color: #007bff;
              text-align: center;
          }
  
          p {
              margin: 10px 0;
          }
  
          ul {
              list-style-type: none;
              padding: 0;
          }
  
          li {
              margin: 5px 0;
          }
  
          .signature {
              font-style: italic;
              color: #888;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Confirmation de Réservation</h1>
          <p>Bonjour ${fullname},</p>
          <p>Votre réservation pour le ${booking_date} (${booking_time === 'matin' ? 'matin (8h00 - 13h00)' : 'après-midi (14h00 - 21h00)'}) a été confirmée avec succès.</p>
          <p>Voici les détails de votre réservation :</p>
          <ul>
              <li>Nom : ${fullname}</li>
              <li>Téléphone : ${phone}</li>
              <li>Date : ${booking_date}</li>
              <li>Heure : ${booking_time === 'matin' ? 'Matin (8h00 - 13h00)' : 'Après-midi (14h00 - 21h00)'}</li>
              <li>Commentsaires : ${comments || 'Aucun commentsaire'}</li>
          </ul>
          <p>Merci pour votre réservation. Nous attendons avec impatience de vous accueillir.</p>
          <p>Nous aimerions également vous informer de nos offres spéciales :</p>
          <ul>
              <li>Un mois à 180Dt, une semaine à 53Dt. </li>
              <li>Obtenez une connexion Internet fibre optique très haut débit pour une productivité maximale.</li>
              <li>Profitez de café et de snacks gratuits en tant qu'abonné.</li>
          </ul>
          <p>Pour plus d'informations sur nos offres d'abonnement, veuillez nous contacter.</p>
          <p class="signature">Cordialement,<br>Votre équipe de réservation, Hathor.</p>
      </div>
  </body>
  </html>
  `;

  // Email data
  const mailOptions = {
    from: 'skanderlahbaiel@gmail.com',
    to: email,
    subject: subject || 'Confirmation de réservation',
    html: emailHTML,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Handle email sending error
      res.status(500).json({ error: 'Email could not be sent' });
    } else {
      console.log('Email sent:', info.response);
      // Email sent successfully
      res.status(200).json({message:"E-mail sent successfuly"}) // Continue to the next middleware or route
    }
  });
}



module.exports = sendConfirmationEmail;
