var express = require('express');
var opn = require('opn');
var path = require('path');
var conf = require('./js/conf.js');
var http = require('http');
//var nodemailer = require('nodemailer');
var app = express();
var reload = require('reload');

global.appRoot = path.resolve(__dirname + "/..");

if(!conf.configExists())
  conf.createConfig();

conf.readConfig();

app.use('/image',express.static(__dirname+'/image'));
app.use('/css', express.static(__dirname+'/css'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/build', express.static(__dirname + '/build'));
app.use('/components', express.static(__dirname + '/components'));
app.use('/node_modules', express.static(path.join(__dirname, '../', 'node_modules')));
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, process.argv[2]));
});

var mainServer = http.createServer(app);
reload(mainServer, app);
mainServer.listen(conf.getConfig().port, conf.getConfig().hostname, function (err){ 
  if(err){
    return console.error(err);
  }
  console.log('listening at http://'+conf.getConfig().hostname+':'+conf.getConfig().port);
});
