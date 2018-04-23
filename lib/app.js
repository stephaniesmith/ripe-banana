const express = require('express');
const app = express();
const errorHandler = require('./util/error-handler');

app.use(express.json());

const actors = require('./routes/actors');
// const films = require('./routes/films');
// const reviews = require('./routes/reviews');
const reviewers = require('./routes/reviewers');
// const studios = require('./routes/studios');

app.use('/actors', actors);
// app.use('/films', films);
// app.use('/reviews', reviews);
app.use('/reviewers', reviewers);
// app.use('/studios', studios);

app.use(errorHandler());

module.exports = app;