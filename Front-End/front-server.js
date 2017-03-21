var express = require('express');
var opn = require('opn');
var path = require('path');
var conf = require('./js/conf.js');
//var https = require('https');
//var nodemailer = require('nodemailer');
var app = express();
//var fs = require('fs');

global.appRoot = path.resolve(__dirname + "/..");

/*var options = {
  key: fs.readFileSync(path.join(__dirname,'key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'cert.pem'))
};*/
if(!conf.configExists())
  conf.createConfig();

conf.readConfig();

app.use('/image',express.static(__dirname+'/image'));
app.use('/css', express.static(__dirname+'/css'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/node_modules', express.static(path.join(__dirname, '../', 'node_modules')));
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, 'index.html'));
});


//https.createServer(options,app)
app.listen(conf.getConfig().port, conf.getConfig().ip, function (err){ 

  if(err){
    return console.error(err);
  }
  console.log('listening at http://'+conf.getConfig().ip+':'+conf.getConfig().port);
  try{
    opn('http://'+conf.getConfig().ip+':'+conf.getConfig().port);
  }
  catch (err){
    console.log("Can't open Browser beacause its on a server without a Frontend");
  }
})
