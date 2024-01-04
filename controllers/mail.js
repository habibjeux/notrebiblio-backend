const ENV = require('../config');
const nodemailer = require('nodemailer');

module.exports.send = (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: ENV.email,
          pass: 'oomxxhxiptswpeci'
        }
      });
      
      const mailOptions = {
        from: req.body.email,
        to: ENV.email,
        subject: req.body.subject,
        text: req.body.text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error)
          res.json({error: error});
        else 
          res.json({message: "Mail envoyé avec succèss"})
      });
}