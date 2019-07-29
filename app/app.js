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

app.post('/api/users/get', function(req, res) {
    console.log(`${req.method} ${req.originalUrl} ${util.inspect(req.body)}`)
    payload = {
        email: req.body.email
    }
    signed_payload = jwt.sign(payload)
    request_params = jwt.formatParams(signed_payload)
    request({
        method: "POST",
        uri: global.gConfig.barong_url,
        json: true,
        body: request_params
    }, (err, result, body) => {
        res.json(body)
        if (err) {
            return console.error(err);
        }
    });
})
