const express=require('express');
const jwt=require('./jwt.js');
const config = require('./config/config.js');
const request = require('request')
const app=express();

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
  console.log(jwt.sign({"email":"admin@barong.io"}))
  request({
    method: "POST",
    uri: global.gConfig.barong_url,
    json: true,
    multipart:
    [ { 'content-type': 'application/json'
      ,  body: JSON.stringify({foo: jwt.sign({"email":"admin@barong.io"}),})
      }
    , { body: 'I am an attachment' }
    ] }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});

  res.json(global.gConfig);
})

app.listen(global.gConfig.node_port || process.env.PORT,()=>{
  console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_port}`);
})
