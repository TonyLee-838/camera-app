const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.use(express.static('public'));
require('./router')(app);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
