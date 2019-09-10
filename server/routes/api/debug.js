let express = require('express')
let router = express.Router()
let code = require('../../node-abstractions/response-codes')
let { getTestEmails, resetTestEmails } = require('../../node-abstractions/email');
let { getAllData, resetData } = require('../../database/external-connections/fake-database-connector')
router.get('/debug', async (req, res) => {
  if(process.env.NODE_ENV !== 'development') return code.unauthorized(res)
  const allData = await getAllData();
  allData.emails = getTestEmails();
  console.log(allData.emails);
  return res.json(allData);
})
router.post('/debug', async (req, res) => {
  if(process.env.NODE_ENV !== 'development') return code.unauthorized(res)
  const userId = req.body.userId;
  const allData = await getAllData(userId);
  allData.emails = getTestEmails(userId);
  return res.json(allData);
})
router.get('/debug-reset', async (req, res) => {
  if(process.env.NODE_ENV !== 'development') return code.unauthorized(res)
  await resetData();
  resetTestEmails();
  return res.json({ok: true})
})

module.exports = router
