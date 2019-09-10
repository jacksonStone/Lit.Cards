let nodeMailer = require('nodemailer')
let isTest = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
let transporter
let testEmails
let resetTestEmails
let getTestEmails
if (!isTest) {
  transporter = nodeMailer.createTransport({
    pool: true,
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  })
} else {
  testEmails = []
  resetTestEmails = () => {
    testEmails = []
  }
  getTestEmails = (userId) => {
    if(userId) {
      return testEmails.filter(email => {
        return email.to === userId;
      })
    }
    return testEmails
  }
  transporter = {
    sendMail: messageDetails => {
      testEmails.push(messageDetails)
      return { messageId: 'fakeEmail' }
    }
  }
}
// TODO:: There may be limits on this sending per-day, so need to make sure I can know if there is an issue
async function sendMail (to, subject, text, html) {
// send mail with defined transport object
  try {
    // Returns unused info object
    await transporter.sendMail({
      from: '"Lit.Cards 🔥" <lit.cards.help@gmail.com>', // sender address
      to,
      subject,
      text,
      html
    })

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (e) {
    console.error(e)
  }
}
// sendMail("jacksonastone@gmail.com", "Hello ✔", "Hello world?", "<b>Hello world?</b>")
module.exports = {
  sendMail,

  // Test only
  getTestEmails,
  resetTestEmails
}
