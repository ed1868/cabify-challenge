require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash      = require('connect-flash');
const _ = require('lodash');

mongoose
  .connect('mongodb://localhost/cabifychallenge', { useNewUrlParser: true })
  .then((x) => {
    console.log('Connected to Cabify Database');
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2) { throw new Error('Handlebars Helper ifUndefined needs 1 parameter'); }
  if (typeof value !== undefined) {
    return options.inverse(this);
  }
  return options.fn(this);
});


// default value for title local
app.locals.title = 'Cabify Challenge - Restaurant Reservations';


// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(flash());
require('./passport')(app);


const index = require('./routes/index');

app.use('/', index);

const restRoutes = require('./routes/restaurants');

app.use('/restaurants', restRoutes);

const authRoutes = require('./routes/auth');

app.use('/eaters', authRoutes);

const groupRoutes = require('./routes/groups');

app.use('/groups', groupRoutes);

const groupPostRoute = require('./routes/groupPost');

app.use('/create_groups', groupPostRoute);

module.exports = app;
