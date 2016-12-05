var execFileSync = require('child_process').execFileSync;
module.exports = 
{
	generateSSHKey:function()
	{
		var out = "";
		try
		{
			var date = new Date();
			var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
			out = execFileSync("ssh-keygen", ["-t", "rsa","-f","key_" + (utcDate.getTime()/1000) + ".rsa","-N", ""], {"cwd": "ssh_keys/"}).toString();
		}
		catch(e)
		{
			out = e.message.toString();
		}
		return out;

	},
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
	}
};
