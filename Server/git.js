var execFileSync = require('child_process').execFileSync;
var querystring = require('querystring');
var http = require('http');
module.exports = 
{	
	createproj:function(user, pass, name)
	{
		var out = execFileSync("curl", ["-i", "-u", user + ":" + pass, "-d", "\'{\"name\":\"" + name + "\"}\'", "-X", "POST", "https://api.github.com/user/repos"]);

		var obj = JSON.parse(out);
		return out;
	},
	clone:function(url)
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["clone", url], {"cwd": "workspace/"}).toString();
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
	push:function(remoteName, branchName, dir)
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["push", remoteName, branchName], {"cwd": "workspace/" + dir});
		}
		catch (e)
		{
			out = e.message.toString();
		}
		return out;
	},
	requestToken:function(params)
	{
		var postData = querystring.stringify({
			"client_id": "a0529985d128d88ea4b7",
			"client_secret": "2bd05f7419968ca3cd47dd64a1eb986db30a08c",
			"code" : params
		});	
		var options = {
		hostname: "www.github.com",
		port: "80",
		path: "/login/oauth/access_token",
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": Buffer.byteLength(postData)
			}
		};
		
		var req = http.request(options, function(res)
		{
			console.log("Begin of server response:");
			console.log("Status: " + res.statusCode);
			console.log("Headers: " + JSON.stringify(res.headers));
			res.on('data', function(chunk)
			{
				console.log(chunk);	
			});	
			res.on('end', function()
			{
				console.log("reached end of data.");
			});
		});

		req.on("error", function(e)
		{
			console.log(e);
		});

		req.write(postData);
		req.end();
	}
};
