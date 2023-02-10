require('dotenv').config()
const { TOKEN, MYTOKEN } = process.env
const axios = require('axios')

module.exports = {
  callbackUrl: async (req, res, next) => {
    try {

      let mode = req.query['hub_node'];
      let challenge = req.query['hub.challenge'];
      let token = req.query['hub.verify_token'];

      if (mode && token) {
        if (mode === 'subcribe' && token === MYTOKEN) {
          res.status(200).send(challenge);
        } else {
          res.status(403);
        }
      }
    } catch (err) {
      next(err)
    }
  },
  // here to check the payload from the customer 
  listenToCustomer: async (req, res, next) => {
    try {
      let bodyParams = req.body;

      console.log(JSON.stringify(bodyParams, null, 2))

      if (bodyParams.object) {
        if (bodyParams.entry && bodyParams.entry[0].changes[0].value.message && bodyParams.entry[0].changes[0].value.message[0]) {
          let phoneNumberID = bodyParams.entry[0].changes[0].value.metadata.phone_number_id;
          let from = bodyParams.entry[0].changes[0].value.messages[0].from;
          let messageContent = bodyParams.entry[0].changes[0].value.messages[0].text.body;

          axios({
            method: "POST",
            url: "https://graph.facebook.com/v15.0/" + phoneNumberID + "/messages?access_token=" + TOKEN,
            data: {
              messanging_product: "whatsapp",
              to: from,
              text: {
                body: "This is the property bot listeing to you"
              }
            },
            headers: {
              "Content-Type": "application/json"
            }
          });
          res.sendStatus(200)
        }
      } else {
        res.sendStatus(404)
      }

    } catch (err) {
      next(err)
    }
  }
}
