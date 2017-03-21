var fs = require('fs');
const publicIp = require('public-ip');
var config = {};
var exports = 
{
  getConfig: function()
  {
    return config;
  },
  configExists: function()
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
  },
  createConfig: function()
  {
    console.log("No front-server.conf file detected! Generating front-server.conf...");
    try
    {
      publicIp.v4().then(ip => {
        
      fs.writeFileSync(global.appRoot + "/front-server.conf", "{\n\t\"ip\": \"0.0.0.0\", \n\t\"port\" : 80, \n\t\"readOnly\" : \""+ip+"/readOnly\"\n}");
      });
    }
    catch(err)
    {
      console.log("Failed to generate front-server.conf! Reason: " + err);
    }
  },
  readConfig: function()
  {
    try
    {
      config = JSON.parse(fs.readFileSync(global.appRoot + "/front-server.conf", "utf8").toString());
    }
    catch(err)
    {
      console.log("Failed to read front-server.conf! Reason: " + err);
    }
  },

};

module.exports = exports;
