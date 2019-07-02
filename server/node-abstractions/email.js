const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
  pool: true,
  service:'Gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});
//TODO:: There may be limits on this sending per-day, so need to make sure I can know if there is an issue
async function sendMail(to, subject, text, html) {
// send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: '"Lit.Cards 🔥" <lit.cards.help@gmail.com>', // sender address
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
}
// sendMail("jacksonastone@gmail.com", "Hello ✔", "Hello world?", "<b>Hello world?</b>")
module.exports = {
  sendMail
}
