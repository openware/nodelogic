const express=require('express');
const jwt = require("jsonwebtoken");
const fs = require('fs')

// const jwt=require('./jwt.js');

const config = require('./config/config.js');
const request = require('request')
const app=express();
var applogic_private_key = null;

try {
  applogic_private_key = fs.readFileSync(String(global.gConfig.jwt.private_key_path), 'utf8')
} catch (err) {
  console.error(err)
}

app.use(require('body-parser').json());
app.use(function(req,res,next){
    try{
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, key.tokenKey, function (err, payload) {
        console.log(payload)
        if (payload) {
            user.findById(payload.userId).then(
                (doc)=>{
                    req.user=doc;
                    next()
                }
            )
        } else {
           next()
        }
    })
}catch(e){
    next()
}
})
app.get('/api/users/get',function(req,res){
  var decoded_key = new Buffer(applogic_private_key.trim(), 'base64').toString('utf-8')
  var payload = Buffer.from(JSON.stringify({ email:"admin@barong.io"})).toString('base64')
  signed_payload = jwt.sign(
    payload,
    decoded_key,
    { algorithm: global.gConfig.jwt.algorithm })
    console.log("SIGNED PAYLOAD:", signed_payload)
  protected = signed_payload.split('.')[0]
  signature = signed_payload.split('.')[2]
  request_params = {
    email: "admin@barong.io",
    payload: payload,
    signatures: [{
    protected: protected,
    header: { kid: "applogic" },
    signature: signature
    }]
  }
    console.log("PAYLOAD:", payload)
    console.log("REQUST_PARAMS:", request_params)
  request({
    method: "POST",
    uri: global.gConfig.barong_url,
    json: true,
    body: request_params }, (err, res, body) => {
      console.log(body)
      if (err) { return console.log(err);
    }
});
  res.json(global.gConfig);
})

app.listen(global.gConfig.node_port || process.env.PORT,()=>{
  console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_port}`);
})
