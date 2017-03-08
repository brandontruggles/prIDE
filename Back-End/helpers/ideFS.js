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
			fs.accessSync(global.appRoot + "/back-server.conf");
		}
		catch(err)
		{
			exists = false;
		}
		return exists;
	},
	createConfig:function() //Creates a new server.conf file with the default values
	{
		console.log("No back-server.conf file detected! Generating server.conf...");
		try
		{
			fs.writeFileSync(global.appRoot + "/back-server.conf", "{\n\t\"port\": 8080,\n\t\"max_clients\": 8\n}");
			console.log("Successfully generated back-server.conf!");
		}
		catch(err)
		{
			console.log("Failed to generate back-server.conf! Reason: " + err);
		}
	},
	readConfig:function() //Reads the data from server.conf
	{
		try
		{
			configObj = JSON.parse(fs.readFileSync(global.appRoot + "/back-server.conf", "utf8").toString());
		}
		catch(err)
		{
			console.log("Failed to read back-server.conf! Reason: " + err);
		}
	},
	workspaceExists:function() //Returns whether or not the global Workspace directory exists
	{
		var exists = true;
		try
		{
			fs.accessSync(global.appRoot + "/Workspace/");
		}
		catch(err)
		{
			exists = false;
		}
		return exists;
	},
	createWorkspace:function() //Creates a new global Workspace directory
	{
		console.log("No Workspace directory detected! Generating Workspace directory...");
		try
		{
			fs.mkdirSync(global.appRoot + "/Workspace/");
			console.log("Successfully generated a new Workspace directory!");
		}
		catch(err)
		{
			console.log("Failed to generate the Workspace directory! Reason: " + err);
		}
	},
	getProjectFiles:function(dir) //Returns a list of files contained in a specified directory
	{
		var files = null;
		try
		{
			files = fs.readdirSync(global.appRoot + "/Workspace/" + dir);
		}
		catch(err)
		{
			console.log("Failed to read files from the current project directory!");
		}
		return files;
	},
	compile:function(prog, args, dir) //Compiles all the files within a specified directory (should be changed in the future to only compile one single file)
	{
		var extensionIndex = (prog.length) - 1;
		while(extensionIndex > -1 && prog.charAt(extensionIndex) != ".")
			extensionIndex--;
		extensionIndex++; //The file extension starts one position after the last dot in the file name
		var extension = prog.substring(extensionIndex);
		var str = "";
		var splitArgs = args.split(" ");
		if(args == "")
			splitArgs = [];

		switch(extension)
		{
			case "java":
				str = execFileSync("javac", [global.appRoot + "/Workspace/" +dir + "/" +  prog].concat(splitArgs), {stdio: ['pipe', 'pipe', 'pipe']}).toString();
				break;
			case "c":
				str = execFileSync("gcc", ["-o", global.appRoot + "/Workspace/" + dir + "/" + prog.replace("." + extension, ""), global.appRoot + "/Workspace/" + dir + "/" + prog].concat(splitArgs), {stdio: ['pipe', 'pipe', 'pipe']}).toString();
				break;
			case "cpp":
				str = execFileSync("g++", ["-o", global.appRoot + "/Workspace/" + dir + "/" + prog.replace("." + extension, ""), global.appRoot + "/Workspace/" + dir + "/" + prog].concat(splitArgs), {stdio: ['pipe', 'pipe', 'pipe']}).toString();
				break;
			default:
				str = "File extension not recognized! Unable to compile!";
				break;	
		}	
		console.log(prog);	
		return str;
	},
	run:function(prog, args, dir) //Runs a specified file on the server, within a specified directory, and with the specified arguments
	{
		var extensionIndex = prog.length - 1;
		while(extensionIndex > -1 && prog.charAt(extensionIndex) != ".")
			extensionIndex--;
		extensionIndex++; //The file extension starts one position after the last dot in the file name
		var extension = prog.substring(extensionIndex, prog.length);
		prog = prog.replace("." + extension, "");
		var str = "";
		var splitArgs = args.split(" ");
		if(args == "")
			splitArgs = [];

		switch(extension)
		{
			case "java":
				str = execFileSync("java", ["-cp", global.appRoot + "/Workspace/" + dir, prog].concat(splitArgs)).toString();	
				break;
			case "c":
				str = execFileSync("./", [global.appRoot + "/Workspace/" + dir, prog].concat(splitArgs)).toString();
				break;
			case "cpp":
				str = execFileSync("./", [global.appRoot + "/Workspace/" + dir, prog].concat(splitArgs)).toString();
				break;
			case "python":
				str = execFileSync("python", [global.appRoot + "/Workspace/" + dir, prog].concat(splitArgs)).toString();
				break;
			default:
				str = "File extension not recognized! Unable to execute the program!";
				break;
		}
		console.log(str);
		return str;
	},
	createFile:function(fileName, dir)
	{
		var extensionIndex = fileName.length - 1;
		while(extensionIndex > -1 && fileName.charAt(extensionIndex) != ".")
			extensionIndex--;
		extensionIndex++; //The file extension starts one position after the last dot in the file name
		var extension = fileName.substring(extensionIndex, fileName.length);
		var fileContents = "";

		switch(extension)
		{
			case "java":
				fileContents = "public class " + fileName.replace("." + extension, "") + "\n{\n}";
				break;
			case "c":
				fileContents = "int main(int argc, char **argv)\n{\n\treturn 0;\n}";
				break;
			case "cpp":
				fileContents = "int main(int argc, char **argv)\n{\n\treturn 0;\n}";
				break;
			case "python":
				fileContents = "print 'Hello World!'";
				break;
			default:
				break;
		}
		if(!fs.existsSync(global.appRoot + "/Workspace/" + dir + "/" + fileName))
		{
			fs.writeFileSync(global.appRoot + "/Workspace/" + dir + "/" + fileName, fileContents);
			return true;
		}

		console.log("Failed to create a file with the name '" + fileName + "' within the current project because a file with that name already exists!");
		return false;
	},
	deleteFile:function(fileName, dir) //Deletes the specified file on the server, within a specified directory
	{
		if(fs.existsSync(global.appRoot + "/Workspace/" + fileName))
		{
			fs.unlinkSync(global.appRoot + "/Workspace/" + fileName);
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
		if(!fs.existsSync(global.appRoot + "/Workspace/" + dir))
		{
			fs.mkdirSync(global.appRoot + "/Workspace/" + dir);
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
				if(fs.lstatSync(global.appRoot + '/Workspace/'+curpath+proj[dir]+'/'+explorer[explorer.length-1][f]).isDirectory())
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
