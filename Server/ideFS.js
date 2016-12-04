var fs = require('fs');
var configObj = {};
module.exports = 
{
	getConfigObj:function()
	{
		return configObj;
	},
	configExists:function()
	{
		var exists = true;
		try
		{
			fs.accessSync("server.conf");
		}
		catch(err)
		{
			exists = false;
		}
		return exists;
	},
	createConfig:function()
	{
		console.log("No server.conf file detected! Generating server.conf...");
		try
		{
			fs.writeFileSync("server.conf", "{\n\t\"port\": 8080,\n\t\"max_clients\": 8\n}");
			console.log("Successfully generated server.conf!");
		}
		catch(err)
		{
			console.log("Failed to generate server.conf! Reason: " + err);
		}
	},
	readConfig:function()
	{
		try
		{
			configObj = JSON.parse(fs.readFileSync("server.conf", "utf8").toString());
		}
		catch(err)
		{
			console.log("Failed to read server.conf! Reason: " + err);
		}
	},
	writeConfig:function()
	{
		try
		{
			fs.writeFileSync("server.conf", JSON.stringify(configObj, null, "\t"));
		}
		catch(err)
		{
			console.log("Failed to write server.conf! Reason: " + err);
		}
	},
	getProjectFiles:function(dir)
	{
		var files = null;
		try
		{
			files = fs.readdirSync("workspace/" + dir);
		}
		catch(err)
		{
			console.log("Failed to read files from the current project directory!");
		}
		return files;
	},      	
	newfile:function(filename, dir)
	{
		var out = "";
		try
		{
			out = execFileSync("touch", [filename], {"cwd": "workspace/" + dir});
		}
		catch (e)
		{
			out = e.message.toString();
		}
		return out;
	},
	compile:function(dir)
	{
		var files = getProjectFiles(dir);
		var flies = [];
		for (var i = 0; i < files.length; i++)
		{
			if (files[i].substr(files[i].length - 5) == ".java")
			{
				flies.push("workspace/" + dir + "/" + files[i]);
			}
		}
		try
		{
			var ret = execFileSync("javac", flies, {stdio: ['pipe', 'pipe', 'pipe']}).toString();
			return ret;
		}
		catch (error)
		{
			return error.message;
		}
	},
	run:function(prog, args, dir)
	{
		prog = prog.replace(".java","");
		var str = execFileSync("java", ["-cp", "workspace/" + dir, prog]).toString();
		return str;
	},
	listproj:function(user)
	{
		execFileSync("curl https://api.github.com/users/" + user + "/repos", writeout);
		out = fs.readFileSync("stdout.txt", "utf8").toString();
		var obj = JSON.parse(out);

		return obj;
	},
	createFile:function(fileName, dir)
	{
		if(!fs.existsSync("workspace/" + dir + "/" + fileName))
		{
			fs.writeFileSync("workspace/" + dir + "/" + fileName,"public class " + fileName.replace(".java", "") + "\n{\n\tpublic static void main(String[] args)\n\t{\n\t\t// Edit this class as you please\n\t\tSystem.out.println(\"Hello World!\");\n\t}\n}");
		}
		else
		{
			console.log("Failed to create a file with the name '" + fileName + "' within the current project because a file with that name already exists!");
			return false;
		}
		return true;
	},
	deleteFile:function(fileName)
	{
		if(fs.existsSync("workspace/" + fileName))
		{
			fs.unlinkSync("workspace/" + fileName);
		}
		else
		{
			console.log("Failed to delete a file with the name '" + fileName + "' within the current project because a file with that name does not exist!");
			return false;
		}
		return true;
	},
	updateFile:function(fileName, newText, dir)
	{
		if(fs.existsSync("workspace/" + dir + "/" + fileName))
		{
			fs.writeFileSync("workspace/" + dir + "/" + fileName, newText);
		}
		else
		{
			console.log("Failed to write to the file " + fileName + "!");
			return false;
		}
		return true;
	},
	createDirectory:function(dirName, dir)
	{
		if(!fs.existsSync("workspace/" + dir + "/" + dirName))
		{
			fs.mkdirSync("workspace/" + dir + "/" + dirName);
		}
		else
		{
			console.log("Failed to create a directory with the name '" + dirName + "' within the current project because a file with that name already exists!");
			return false;
		}
		return true;
	},
	createProject:function(projectName)
	{
		if(!fs.existsSync(projectName))
		{
			fs.mkdirSync(projectName);
			writeConfig();
		}
		else
		{
			console.log("Failed to create a project with the name '" + projectName + "' since one already exists!");
			return false;
		}
		return true;
	}

};
