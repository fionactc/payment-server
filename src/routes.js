let express = require("express");
let router = new express.Router();

let gateway = require('./braintree');

// one-time use for generating client token
router.get('/client_token', (req, res)=>{
  gateway.clientToken.generate({}, (err, response)=>{
    res.send(response.clientToken);
  })
})

router.post('/checkout', (req, res)=>{
  let nonce = req.body.payment_method_nonce;
  let amount = req.body.amount;

  //TODO: use nonce
  gateway.transanction.sale({
    amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, (err, result)=>{

  })

})
