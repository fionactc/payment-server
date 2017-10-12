let express = require("express");
let router = new express.Router();
let redis = require('../redis');
let mongoUtil = require('../db');
let db = mongoUtil.getDb();

let paypal = require('../lib/paypal').paypal;

router.post('/checkout', (req, res)=>{
  let creditCard = req.body.creditCard;
  let amount     = req.body.amount;
  let currency   = req.body.currency;
  let phone      = req.body.phone;

  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "credit_card",
      "funding_instruments": [ creditCard ],
    },
    "transactions": [{
      "amount": {
        "total": amount,
        "currency": currency
      },
      "description": "This is the payment transaction description."
    }]
  };

  paypal.payment.create(create_payment_json, (err, payment)=>{
    if (err) {
      console.error('Error: ',  err);
      if (err.response.message === 'Invalid request. See details.')
        res.status(400).send(err.response.details[0].issue) // return the first issue
      else 
        res.status(400).send(err.response.message);
    }
    else {
      let paymentRecord = {
        firstName: creditCard['credit_card'].first_name,
        lastName: creditCard['credit_card'].last_name,
        phone,
        currency,
        amount
      };
      redis.set(payment.id, JSON.stringify(paymentRecord));

      // insert to mongo with id
      paymentRecord['_id'] = payment.id;
      db.collection('payments').insert(paymentRecord);

      res.send({ id: payment.id, paymentRecord});
    }
  })
})

module.exports = router;
