let MongoClient = require('mongodb').MongoClient;
let _db;

module.exports = {
  connectToServer: (cb)=>{
    MongoClient.connect("mongodb://localhost:27017/payment_gateway", (err, database)=>{
      _db = database;
      console.log('CONNECTED');
      return cb(err);
    })
  },
  getDb: function() { return _db; }
}
