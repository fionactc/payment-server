let express = require("express");
let router = new express.Router();

// let gateway = require('./braintree');
// let axios   = require('axios');

let request = require('request');
let paypal  = require('paypal-rest-sdk');


router.post('/paypal-checkout', (req, res)=>{
  let creditCard = req.body.creditCard;
  let amount     = req.body.amount;
  let currency   = req.body.currency;

  paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.PAYPAL_CLIENT,
    'client_secret': process.env.PAYPAL_SECRET
  })

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
        console.log(err);
        console.log(err.response.details);
      }
      else {
        console.log('this is payment');
        console.log(payment);
        res.send(payment);
      }
    })
})



module.exports = router;
