var express = require('express');
var opn = require('opn');
var path = require('path');
var fs = require('fs');
var http = require('http');
var app = express();
var reload = require('reload');

global.appRoot = path.resolve(__dirname + "/..");

function configExists()
{
	var exists = true;
	try
	{
		fs.accessSync(global.appRoot + "/front-server.conf");
	}
	catch(err)
	{
		exists = false;
	}
	return exists;
}

function createConfig()
{
    console.log("No front-server.conf file detected! Generating front-server.conf...");
    try
    {
	fs.writeFileSync(global.appRoot + "/front-server.conf", "{\n\t\"hostname\": \"0.0.0.0\", \n\t\"port\" : 80\n}");
    }
    catch(err)
    {
	console.log("Failed to generate front-server.conf! Reason: " + err);
    }
}

function readConfig()
{
    var obj = null;
    try
    {
	obj = JSON.parse(fs.readFileSync(global.appRoot + "/front-server.conf", "utf8").toString());
    }
    catch(err)
    {
	console.log("Failed to read front-server.conf! Reason: " + err);
    }	
    return obj;
}

if(!configExists()) 
	createConfig();

var config = readConfig();

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
mainServer.listen(config.port, config.hostname, function (err){ 
  if(err){
    return console.error(err);
  }
  console.log('listening at http://'+config.hostname+':'+config.port);
});
