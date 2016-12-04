var execFileSync = require('child_process').execFileSync;
module.exports = 
{
	createproj:function(user, pass, name)
	{
		var out = execFileSync("curl", ["-i", "-u", user + ":" + pass, "-d", "\'{\"name\":\"" + name + "\"}\'", "-X", "POST", "https://api.github.com/user/repos"]);

		var obj = JSON.parse(out);
		return out;
	},
	testlogin:function(user, pass)
	{
		var out = execFileSync("curl", ["-u", user + ":" + pass, "https://api.github.com"]);

		var obj = JSON.parse(out);
		if (obj.message)
			return true;
		return false;
	},
	clone:function(url)
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["clone", url], {"cwd": "workspace"}).toString();
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
	push:function(dir)
	{
		var out = "";
		try
		{
			out = execFileSync("git", ["push", "origin", "master"], {"cwd": "workspace/" + dir});
		}
		catch (e)
		{
			out = e.message.toString();
		}
		return out;
	}
};
