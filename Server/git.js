var execFileSync = require('child_process').execFileSync; //Used to execute terminal commands on the server
var querystring = require('querystring'); //Used to set POST request parameters with JSON
var https = require('https'); //Used to make HTTPS requests

//Export a JSON object containing helper functions for git and Github functionality
module.exports =
{
	init:function(dir) //Execute the command "git init" on the server within a specified directory
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["init"], {"cwd": "workspace/" + dir});
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;
	},
	addremote:function(dir, remoteName, url) //Execute the command "git remote add remoteName" on the server within a specified directory
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["remote", "add", remoteName, url], {"cwd": "workspace/" + dir}).toString();
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;
	},
	clone:function(dir, url, token) //Execute the command "glit clone url" on the server within a specified directory, using the Github authentication tokenfrom a particular client 
	{
		var out = "";
		try
		{
			if(token != null)
			{
				out = execFileSync("git", ["clone", "https://" + token + "@github.com:" + url], {"cwd": "workspace/"}).toString();
			}
			else
			{
				out = execFileSync("git", ["clone", url], {"cwd": "workspace/"}).toString();
			}
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;
	},
	pull:function(dir) //Execute the command "git pull" on the server, within the specified directory
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["pull"], {"cwd": "workspace/" + dir});
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;
	},
	add:function(filename, dir) //Execute the command "git add filename" on the server, within the specified directory
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["add", filename], {"cwd": "workspace/" + dir});
		}
		catch (e)
		{
			out =  e.message.toString();
		}
		return out;
	},
	setEmail:function(email, dir) //Temporarily set the global email for git to the email of a particular user
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["config", "--global", "user.email", email], {"cwd": "workspace/" + dir});
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;
	},
	setName:function(name, dir) //Temporarily set the global name for git to the name of a particular user
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["config", "--global", "user.name", name], {"cwd": "workspace/" + dir});
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;
	},
	commit:function(message, dir) //Execute the command "git commit -am message" on the server, within the specified directory
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["commit", "-am", message], {"cwd": "workspace/" + dir});
		}
		catch (e)
		{
			out = e.message.toString();
		}
		return out;
	},
	checkout:function(branchName, dir) //Execute the command "git checkout branchName" on the server, within the specified directory
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["checkout", branchName], {"cwd": "workspace/" + dir});
		}
		catch (e)
		{
			out = e.message.toString();
		}
		return out;
	},
	createBranch:function(branchName, dir) //Execute the command "git checkout -b branchName" on the server, within the specified directory
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["checkout", "-b", branchName], {"cwd": "workspace/" + dir});
		}
		catch (e)
		{
			out = e.message.toString();
		}
		return out;
	},
	push:function(dir, token, remoteName, branchName) //Execute the command "git push remoteName branchName" on the server, within the specified directory, and with the Github authentication token for a particular client
	{
		var out = "";
		try
		{
			if(token != null)
			{
				out = execFileSync("git", ["push", "https://" + token + "@" + remoteName.replace("https://",""), branchName], {"cwd": "workspace/" + dir});
			}
		}
		catch (e)
		{
			out = e.message.toString();
		}
		return out;
	},
	requestToken:function(params, callback, connectionList, connind) //Request a Github authentication token for a specific user after they have logged in on the browser
	{
		var postData = querystring.stringify({
			"client_id": "a0529985d128d88ea4b7",
			"client_secret": "a2bd05f7419968ca3cd47dd64a1eb986db30a08c",
			"code" : params
		});
		//https://www.github.com/login/oauth/access_token
		//git push https://token@github.com/brandonrninefive/prIDE.git master
		var options = {
		hostname: "github.com",
		port: "443",
		path: "/login/oauth/access_token",
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": Buffer.byteLength(postData)
			}
		};

		var req = https.request(options, function(res)
		{
			//console.log("Begin of server response:");
			//console.log("Status: " + res.statusCode);
			//console.log("Headers: " + JSON.stringify(res.headers));
			res.on('data', function(chunk)
			{
				if(res.statusCode == 200)
				{
					token = JSON.parse(chunk.toString()).access_token;
					callback(token, connectionList, connind);
				}
			});
			res.on('end', function()
			{
				//console.log("reached end of data.");
			});
		});

		req.on("error", function(e)
		{
			console.log(e.message);
		});

		req.write(postData);
		req.end();
	},
	requestUserInfo:function(token, callback, connectionList, connind) //Request the email and name of a user from their Github account using the Github API and their authentication token
	{
		//https://www.github.com/login/oauth/access_token
		//git push https://token@github.com/brandonrninefive/prIDE.git master
		var options = {
		hostname: "api.github.com",
		port: "443",
		path: "/user?access_token="+token,
		method: "GET",
		headers: {
			"Accept": "application/json",
			"User-Agent": "prIDE"
		}
		};

		var req = https.request(options, function(res)
		{
			//console.log("Begin of server response:");
			//console.log("Status: " + res.statusCode);
			//console.log("Headers: " + JSON.stringify(res.headers));
			var jsonDoc = "";
			res.on('data', function(chunk)
			{

				if(res.statusCode == 200)
				{
					jsonDoc += chunk.toString();
					//token = JSON.parse(chunk.toString()).access_token;
					//callback(token, connectionList, connind);
				}
			});
			res.on('end', function()
			{
				//console.log(jsonDoc);
				callback(JSON.parse(jsonDoc), connectionList, connind);
				//console.log("reached end of data.");
			});
		});

		req.on("error", function(e)
		{
			console.log(e.message);
		});

		req.end();
	},
	storeInfo:function(infoObj, connectionList, connind) //Store the name and email of a particular user using the information provided by their Github account
	{
		connectionList[connind].name = infoObj.name;
		connectionList[connind].email = infoObj.email;
	},
	storeToken:function(token, connectionList, connind) //Store the Github authentication token for a particular client
	{
		connectionList[connind].token = token;
		this.requestUserInfo(token, this.storeInfo, connectionList, connind);
	}
};
