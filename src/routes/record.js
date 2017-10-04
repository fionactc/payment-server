let express = require("express");
let router = new express.Router();

let redis = require('../redis');

router.post('/record', (req, res)=>{
  let id = req.body.id;
  let first_name = req.body.first_name;
  let last_name  = req.body.last_name;

  if (id && first_name && last_name) {
    redis.get(id, (err, result)=>{
      if (result) {
        let record = JSON.parse(result);
        if (record.firstName === first_name && record.lastName === last_name) 
          res.send(record);
        else
          res.status(400).send('Name is incorrect');
      } else 
        res.status(404).send('No matching record');
    })
  } else 
    res.status(400).send('Missing body data');
})

module.exports = router;
