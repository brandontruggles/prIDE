var execFileSync = require('child_process').execFileSync;
var querystring = require('querystring');
var https = require('https');
module.exports =
{
	init:function(dir)
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
	addremote:function(dir, remoteName, url)
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
	clone:function(dir, url, token)
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
	pull:function(dir)
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
	add:function(filename, dir)
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
	setEmail:function(email, dir)
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
	setName:function(name, dir)
	{
		var out = "";
		try
		{
			out = execFileSync("git" ["config", "--global", "user.name", name], {"cwd": "workspace/" + dir});
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;
	},
	commit:function(message, dir)
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
	checkout:function(branchName, dir)
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
	createBranch:function(branchName, dir)
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
	push:function(dir, token, remoteName, branchName)
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
	requestToken:function(params, callback, connectionList, connind)
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
					console.log(token);
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
	requestUserInfo:function(token, callback, connectionList, connind)
	{
		console.log(token);
		//https://www.github.com/login/oauth/access_token
		//git push https://token@github.com/brandonrninefive/prIDE.git master
		var options = {
		hostname: "api.github.com",
		port: "443",
		path: "/user?access_token="+token,
		method: "GET"
/*		headers: {
			"Accept": "application/json",
			"Content-Length": Buffer.byteLength(getData)
		}*/
		};

		var req = https.request(options, function(res)
		{
			//console.log("Begin of server response:");
			//console.log("Status: " + res.statusCode);
			//console.log("Headers: " + JSON.stringify(res.headers));
			res.on('data', function(chunk)
			{
				console.log("Status Code: " + res.statusCode);
				console.log("Chunk: "+chunk.toString());
				if(res.statusCode == 200)
				{
					callback(token, JSON.parse(chunk.toString()), connectionList, connind);
					//token = JSON.parse(chunk.toString()).access_token;
					//callback(token, connectionList, connind);
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

		req.end();
	}
};
