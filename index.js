require('dotenv').config();

let express    = require('express');
let app        = express();
let bodyParser = require('body-parser');
let cors       = require('cors'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=>{ res.send('Welcome') })
app.use('/braintree', require('./src/routes/braintree'));
app.use('/paypal', require('./src/routes/paypal'));
app.use('/', require('./src/routes/record'));

// module.exports = app;

app.listen(process.env.PORT || 8000, function() {
  console.log('Listening on port 8000');
})
