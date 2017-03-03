var fs = require('fs');
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
      fs.accessSync("express.conf");
    }
    catch(err)
    {
      exists = false;
    }
    return exists;
  },
  createConfig: function()
  {
    console.log("No conf file detected! Generating express.conf...");
    try
    {
      fs.writeFileSync("express.conf", "{\n\t\"ip\": \"0.0.0.0\", \n\t\"port\" : 9001\n}");
    }
    catch(err)
    {
      console.log("Failed to generate express.conf! Reason: " + err);
    }
  },
  readConfig: function()
  {
    try
    {
      config = JSON.parse(fs.readFileSync("express.conf", "utf8").toString());
    }
    catch(err)
    {
      console.log("Failed to read express.conf! Reason: " + err);
    }
  },

};

module.exports = exports;
