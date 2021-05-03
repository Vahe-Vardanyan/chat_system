var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
//
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var rchat = require('./routes/rchat');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useCreateIndex: true, useNewUrlParser: true,useFindAndModify:false}).then(
    () => { console.log('DB connected!') },
    err => { console.error(err) }
);

var app = express();
// +
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// +
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionParser = session({ secret: 'shhsecret', resave: true, saveUninitialized: true });

app.use(sessionParser /*session({ secret: 'shhsecret', resave: true, saveUninitialized: true })*/ );
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/chat', rchat);

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            status: err.status,
        });
        next();
    }); 
}

var port = process.env.PORT || 3000;
app.listen(port);
//
require('./msging')(app);
module.exports = app;