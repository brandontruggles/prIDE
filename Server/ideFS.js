var fs = require('fs'); //Used to read and write from/to files on the server
var execFileSync = require('child_process').execFileSync; //Used to execute terminal commands on the server

var configObj = {}; //Object used to store the data read in from server.conf

//Export a json object containing a series of helper functions for file system operations
var exports =
{
	getConfigObj:function() //Returns the object containing data read from server.conf
	{
		return configObj;
	},
	configExists:function() //Returns whether or not server.conf exists
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
	createConfig:function() //Creates a new server.conf file with the default values
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
	readConfig:function() //Reads the data from server.conf
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
	workspaceExists:function() //Returns whether or not the global workspace directory exists
	{
		var exists = true;
		try
		{
			fs.accessSync("workspace/");
		}
		catch(err)
		{
			exists = false;
		}
		return exists;
	},
	createWorkspace:function() //Creates a new global workspace directory
	{
		console.log("No workspace directory detected! Generating workspace directory...");
		try
		{
			fs.mkdirSync("workspace/");
			console.log("Successfully generated a new workspace directory!");
		}
		catch(err)
		{
			console.log("Failed to generate the workspace directory! Reason: " + err);
		}
	},
	getProjectFiles:function(dir) //Returns a list of files contained in a specified directory
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
	compile:function(dir) //Compiles all the files within a specified directory (should be changed in the future to only compile one single file)
	{
		var files = exports.getProjectFiles(dir);
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
	run:function(prog, args, dir) //Runs a specified file on the server, within a specified directory, and with the specified arguments
	{
		prog = prog.replace(".java","");
		var str = execFileSync("java", ["-cp", "workspace/" + dir, prog].concat(args)).toString();
		return str;
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
	deleteFile:function(fileName, dir) //Deletes the specified file on the server, within a specified directory
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
	createDirectory:function(dir) //Creates the specified directory on the server
	{
		if(!fs.existsSync("workspace/" + dir))
		{
			fs.mkdirSync("workspace/" + dir);
		}
		else
		{
			console.log("Failed to create a directory with the name '" + dir + "' within the current project because a file with that name already exists!");
			return false;
		}
		return true;
	},
	createProject:function(projectName) //Creates a new project directory on the server
	{
		if(!fs.existsSync(projectName))
		{
			fs.mkdirSync(projectName);
		}
		else
		{
			console.log("Failed to create a project with the name '" + projectName + "' since one already exists!");
			return false;
		}
		return true;
	},
	explorerCreator:function(explorer, proj, curpath, pathing) //Used to generate the file explorer for connected clients
	{
		var newproj = [];
		for(var dir in proj)
		{
			explorer.push(this.getProjectFiles(curpath+proj[dir]));
			pathing.push(curpath+proj[dir]);
			for(var f in explorer[explorer.length-1])
			{
				if(fs.lstatSync('workspace/'+curpath+proj[dir]+'/'+explorer[explorer.length-1][f]).isDirectory())
				{
					newproj.push(explorer[explorer.length-1][f]);
					//point to array with folder in it
					explorer[explorer.length-1][f]+='/';
				}//if directory

			}//finds all directories within directory
			if(newproj.length != 0)
			{
				exports.explorerCreator(explorer,newproj,curpath+proj[dir]+'/', pathing);
				newproj = [];
			}
		}//completed array
	}
};

module.exports = exports;
