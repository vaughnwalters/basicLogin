  'use strict';

const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const routes = require('./routes');
const app = express();
const bodyParser = require('body-parser')
const { connect } = require('./db/database.js')

const port = process.env.PORT || 2000
app.set('port', port);

// pug configuration
app.set('view engine', 'pug')

app.locals.errors = {} // errors & body added to avoid guard statements
app.locals.body = {} // i.e. value=(body && body.name) vs. value=body.name

// middlewares
app.use(session({
  store: new RedisStore(),
  secret: 'loginBasicJam'
}))

app.use((req, res, next) => {
  console.log("req.session", req.session );
  app.locals.email = req.session && req.session.email
  next()
})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))


// routes
app.use(routes)

// instantiate the DB and then on success, connect to the port
connect()
  .then(() => 
    app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })
).catch(console.error);


