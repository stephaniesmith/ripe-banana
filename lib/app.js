const express = require('express');
const app = express();
const errorHandler = require('./util/error-handler');

app.use(express.json());

const actor = require('./routes/actor');
const film = require('./routes/film');
const review = require('./routes/review');
const reviewer = require('./routes/reviewer');
const studio = require('./routes/studio');

app.use('/actor', actor);
app.use('/film', film);
app.use('/review', review);
app.use('/reviewer', reviewer);
app.use('/studio', studio);

app.use(errorHandler());

module.exports(app);