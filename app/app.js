const util = require("util");
const express = require('express');
const app = express();
const config = require('../config/config.js');
const barongAuth = require('node-auth-barong')
const barong_jwt_public_key = Buffer.from(global.gConfig.barong_jwt_public_key.trim(), 'base64').toString('utf-8')

app.use(require('body-parser').json());

app.listen(global.gConfig.node_port || process.env.PORT, () => {
  console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_port}`);
})

/* Add node-auth-barong middleware to validate the jwt in request and add session object to request.
   If JWT is not valid then error is returned in the response with error message.
   Valid JWT is decoded and session object is attached to the request object, which is passed to the next middleware.
*/

app.use(barongAuth({barongJwtPublicKey: barong_jwt_public_key }))

// When JWT is verified hello message is returned to the authorized user.
app.get('/api/v2/jwt/verify', function(req, res) {
  console.log(`${req.method} ${req.originalUrl} ${util.inspect(req.body)}`)

  res.send(`Hello, ${req.session.email}`)
})
