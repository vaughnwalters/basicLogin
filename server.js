'use strict';

const express = require('express');
const session = require('express-sessions');
const RedisStore = require('connect-redis');
const routes = require('./routes');
const app = express();

const port = process.env.PORT || 2000
app.set('port', port);

// pug configuration
app.set('view engine', 'pug')


// routes
app.use(routes)

// // middlewares
// app.use(session({
//   store: new RedisStore(),
//   secret: 'pizzadescottsupersecretkey'
// }))

app.use((req, res, next) => {
  app.locals.email = req.session.email
  next()
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})




