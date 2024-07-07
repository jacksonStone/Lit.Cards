const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.CARDS_SENDGRID_API_KEY)

let isTest = process.env.NODE_ENV === 'test'
let transporter
let testEmails
let resetTestEmails
let getTestEmails
if (!isTest) {
  transporter = {
    sendMail: (details) => {
      return sgMail.send(details)
    }
  }
} else {
  testEmails = []
  resetTestEmails = () => {
    testEmails = []
  }
  getTestEmails = (userEmail) => {
    if (userEmail) {
      return testEmails.filter(email => {
        return email.to === userEmail
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
  // throw Error("Example error");
// send mail with defined transport object
  try {
    // Returns unused info object
    let info = await transporter.sendMail({
      from: `Libby.Cards 🔥<${process.env.CARDS_EMAIL_ADDRESS}>`, // sender address
      to,
      subject,
      text,
      html
    })
    console.log("Sent Email!", { from: `Libby.Cards 🔥<${process.env.CARDS_EMAIL_ADDRESS}>`, // sender address
    to,
    subject,
    text,
    html})

    console.log('Message sent: %s', info)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (e) {
    console.log(e)
    console.error(e)
  }
}
module.exports = {
  sendMail,

  // Test only
  getTestEmails,
  resetTestEmails
}
