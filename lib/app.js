const express = require('express');
const app = express();
const errorHandler = require('./util/error-handler');

app.use(express.json());

const actor = require('./routes/actors');
// const film = require('./routes/films');
// const review = require('./routes/reviews');
const reviewer = require('./routes/reviewers');
// const studio = require('./routes/studios');

app.use('/actors', actor);
// app.use('/films', film);
// app.use('/reviews', review);
app.use('/reviewers', reviewer);
// app.use('/studios', studio);

app.use(errorHandler());

module.exports = app;