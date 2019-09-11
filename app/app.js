const util = require("util");
const express = require('express');
const app = express();
const request = require('request')
const config = require('../config/config.js');
const barongAuth = require('node-auth-barong')
const barong_jwt_public_key = Buffer.from(global.gConfig.barong_jwt_public_key.trim(), 'base64').toString('utf-8')
const appPrivateKey = Buffer.from(global.gConfig.jwt.private_key.trim(), 'base64').toString('utf-8')

app.use(require('body-parser').json());

app.listen(global.gConfig.node_port || process.env.PORT, () => {
  console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_port}`);
})

/* Add node-auth-barong middleware to validate the jwt in request and add session object to request.
   If JWT is not valid then error is returned in the response with error message.
   Valid JWT is decoded and session object is attached to the request object, which is passed to the next middleware.
*/

app.use(barongAuth.sessionVerifier({barongJwtPublicKey: barong_jwt_public_key }))

// When JWT is verified hello message is returned to the authorized user.
app.get('/api/v2/jwt/verify', function(req, res) {
  console.log(`${req.method} ${req.originalUrl} ${util.inspect(req.body)}`)

  res.send(`Hello, ${req.session.email}`)
})

app.post('/api/v2/deposit', function( req, res, next) {

    if (req.session.role =! "admin") {
      res.status(401);
      res.send(`Deposit submittion is allowed only for admins`);
    }

    req.management = { payload: {
        uid: req.session.uid,
        currency: req.body.currency_id,
        amount: req.body.amount
        }
    }
    next();
}, barongAuth.managementSigner({privateKey: appPrivateKey}), function(req,res) {
    request({
      method: "POST",
      uri:  `${global.gConfig.peatio_url}/api/v2/management/deposits/new`,
      json: true,
      body: req.body
    }, (err, result, body) => {
      res.json(body)
      if (err) {
          return console.error(err);
      }
    });
})
