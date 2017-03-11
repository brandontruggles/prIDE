var express = require('express');
var opn = require('opn');
var path = require('path');
var conf = require('./js/conf.js');
var nodemailer = require('nodemailer');
var app = express();

global.appRoot = path.resolve(__dirname + "/..");

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


app.listen(conf.getConfig().port, conf.getConfig().ip, function (err){ 
  if(err){
    return console.error(err);
  }
  console.log('listening at http://'+conf.getConfig().ip+':'+conf.getConfig().port);
  opn('http://'+conf.getConfig().ip+':'+conf.getConfig().port);
})

