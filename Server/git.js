var execFileSync = require('child_process').execFileSync;
module.exports = 
{
	runGit:function(params, dir)
	{
		execFileSync("git", params.split(' '), {"cwd": "workspace/" + dir});
	},
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
		var out = execFileSync("git", ["clone", url], {"cwd": "workspace"}).toString();
		console.log(out);
		return out;
	},	
	pull:function(dir)
	{
		var out = execFileSync("git", ["pull"], {"cwd": "workspace/" + dir});
		console.log(out.toString());
		return out.toString();
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
