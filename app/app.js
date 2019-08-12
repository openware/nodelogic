const util = require("util");
const express = require('express');
const jwt = require('./jwt.js');
const request = require('request')
const app = express();
const config = require('../config/config.js');

app.use(require('body-parser').json());

app.listen(global.gConfig.node_port || process.env.PORT, () => {
  console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_port}`);
})


// Validates the jwt and verifies the signature. Returns the email from JWT
app.get('/api/v2/jwt/verify', function(req, res) {
  // JWT is injected by Envoy in Authorization header
  console.log('JWT returned by BARONG:',req.headers.authorization)
  console.log(`${req.method} ${req.originalUrl} ${util.inspect(req.body)}`)
  var jwt_token;

  try {
    jwt_token = jwt.verify(req.headers.authorization.split('Bearer ')[1])
  }
  catch(error) {
    console.error(error);
  }
  res.send(jwt_token.email)
})

// Validates the JWT, takes email from it and queries barong management API to return current user.
app.get('/api/v2/users/me', function(req, res) {
  console.log(`${req.method} ${req.originalUrl} ${util.inspect(req.body)}`)

  var jwt_token;
  try {
    jwt_token = jwt.verify(req.headers.authorization.split('Bearer ')[1])
  }
  catch(error) {
    console.error(error);
  }

  payload = {
      email: jwt_token.email
  }

  signed_payload = jwt.sign(payload)
  request_params = jwt.formatParams(signed_payload)
  request({
      method: "POST",
      uri: global.gConfig.barong_url+'users/get',
      json: true,
      body: request_params
  }, (err, result, body) => {
      res.json(body)
      if (err) {
          return console.error(err);
      }
  });
})
