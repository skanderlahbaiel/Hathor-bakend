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

function sendDeniedEmail(req, res, next) {
    const { email, booking_time, subject, id, booking_date, fullname, comment, phone } = req.body;
  
    const emailHTML = `<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Indisponibilité de la plage horaire</title>
        <style>
            /* Add your CSS styles here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #007bff;
                color: #fff;
                text-align: center;
                padding: 20px 0;
            }
            .content {
                padding: 20px;
            }
            .message {
                font-size: 18px;
                margin-bottom: 20px;
            }
            .cta-button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
            .cta-button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Indisponibilité de la plage horaire</h1>
            </div>
            <div class="content">
                <p class="message">Cher(e) ${fullname},</p>
                <p>Nous regrettons de vous informer que la plage horaire que vous avez demandée (${booking_date.slice(0,10)} - ${booking_time}) n'est actuellement pas disponible.</p>
                <p>Veuillez essayer de réserver à un autre moment qui vous convient. Nous nous excusons pour tout inconvénient que cela pourrait causer.</p>
                <p>Si vous avez des questions ou avez besoin d'aide pour choisir une autre plage horaire, n'hésitez pas à nous contacter.</p>
                <p>Merci de votre compréhension et de votre intérêt pour nos services.</p>
                <p>Cordialement,</p>
                <p>Votre équipe de réservation</p>
            </div>
            <div class="footer" style="text-align: center;">
                <a href="https://votre-site-web.com" class="cta-button">Visitez notre site web</a>
            </div>
        </div>
    </body>
    </html>
    `;
  
    // Email data
    const mailOptions = {
      from: 'skanderlahbaiel@gmail.com',
      to: email,
      subject: 'Impossible de Réserver à la Plage Horaire Demandée',
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

  module.exports = sendDeniedEmail;