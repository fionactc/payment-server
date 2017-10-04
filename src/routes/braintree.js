let express = require("express");
let router = new express.Router();
let redis = require('../redis');

let gateway = require('../lib/braintree').gateway;

router.get('/token', (req, res)=>{
  gateway.clientToken.generate({}, (err, response)=>{
    if (err) res.status(500).send('Error');
    else 
      res.send(response.clientToken);
  })
})

router.post('/checkout', (req, res)=>{
  let nonce = req.body.nonce;
  let amount = req.body.amount;
  let customer = req.body.customer;

  gateway.transaction.sale({
    amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, (err, result)=>{
    if (!result.success) {
      console.error('Error ', result);
      res.status(400).send(result.message);
    } else {
      let paymentRecord = {
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        currency: 'USD',
        amount
      }
      redis.set(result.transaction.id, JSON.stringify(paymentRecord));

      res.send({ id: result.transaction.id, paymentRecord});
    }
  })
})

module.exports = router;
