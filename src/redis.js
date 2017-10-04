let redis = require('redis');
let client = redis.createClient(process.env.REDIS_URL || null);

client.on('error', (err)=>{
  console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);
})

module.exports = client;

// 7av6y1dh
