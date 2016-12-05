const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

require('./models');

const config = require('./config');
const routes = require('./routes');
const cors = require('./lib/cors');
const errors = require('./lib/errors');

const app = express();
module.exports = app;

mongoose.connect(config.database);

app.use(cors);
app.use(bodyParser.json());
app.use(routes);
app.use(errors);

app.listen(process.env.PORT || 3000);
