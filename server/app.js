
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var createSheet = require('./routes/createSheet');
var usersRouter = require('./routes/users');

var port = process.env.PORT || '3000';
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/createSheet', createSheet);
app.use('/users', usersRouter);

app.listen(port , () => console.log(`Listening on port ${port}.... `));

module.exports = app;
