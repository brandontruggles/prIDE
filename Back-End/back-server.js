var rtu = require('./helpers/rtu.js'); //Helper library for real-time updates
var git = require('./helpers/git.js'); //Helper library for git and Github integration
var ideFS = require('./helpers/ideFS.js'); //Helper library for most file-system related functions
var fs = require('fs'); //Library used for reading files
var WebSocketServer = require('ws').Server; //Websocket library for creating a server
var path = require('path'); //Used for resolving file paths
var explorer = {}; //Solution Explorer
global.appRoot = path.resolve(__dirname + "/.."); //Define the root project directory as a global variable

console.log(global.appRoot);

function broadcastResponse(connectionList, responseString) //Function used to send a message to all connected clients
{
	connectionList.forEach(function(conn)
	{
		conn.connection.send(responseString);
	});
}

function runServer(portNumber) //Function that creates a new server on a specified port
{
	console.log("Running the IDE server on port " + portNumber + "...");
	var server = new WebSocketServer({port: portNumber});
	var connectionList = []; //List of connected clients
	var connind = -1; //Index of a particular client in the connectionList
	server.on('connection', function connection(ws)
	{
		console.log('New connection attempted!');
		ws.on('message', function incoming(message)
		{
			console.log('received: %s', message);
			var response = {"type": "", "contents": null}; //The generic template for a response from the server
			try
			{
				var json_message = JSON.parse(message); //It is assumed that all incoming messages will be in JSON format
				var nickname = json_message.nickname; //Who sent the message
				var contents = json_message.contents; //The data that the message contained

				//The following 3 variables should be changed to be contents-specific in the future
				var file = json_message.file; //The currently open file on the client
				var dir = json_message.dir; //The directory the currently opened file is contained in on the client
				var change = json_message.change; //Any changes made to the currently opened file on the client
				//////////////////////////////////////////////////

				var command = contents.split(' ')[0].toLowerCase(); //The first part of the message is always the type of command
				var spaceIndex = contents.indexOf(' ');
				var params = contents.substring(spaceIndex + 1); //Everything after the command is the parameters of the command

				if(spaceIndex == -1)
					params = "";

				var token = null; //The Github authentication token for a client (null until set)
				
				var found = false; 
				connectionList.forEach(function(conn) //Search through the list of connections to find which client we're dealing with
				{
					if(conn.connection == ws)
					{
						found = true;
						connind = connectionList.indexOf(conn);
						token = connectionList[connind].token;
					}
				});

				if(found || command == "connect")
				{
					switch(command) //Switch statement to run code associated with different server commands (see the list of possible commands to see what each command type does)
					{
						case "connect":
							response.type = "Connection-Accept";
							if(connectionList.length + 1 > ideFS.getConfigObj().max_clients)
							{
								response.contents = {"Accepted": false, "Reason": "The server you tried to connect to is full."};
								console.log("Rejected incoming connection because the server is full.");
							}
							if(response.contents == null)
							{
								connectionList.forEach(function(conn)
								{
									if(conn.nickname == nickname)
									{
										response.contents = {"Accepted": false, "Reason": "The nickname you selected is already in use on this server. Please enter a unique nickname and try again."};
										console.log("Rejected incoming connection for taken nickname.");
									}
								});
							}
							if(response.contents == null)
							{
								ideFS.explorerCreator(explorer = {}, '/');
								connectionList.push({"connection":ws,"nickname":nickname,"token":null,"name":null,"email":null});
								response.contents = {"Accepted": true, "Files": explorer};
								console.log("Accepted incoming connection from user '"+ nickname  +"'.");
							}
							ws.send(JSON.stringify(response));
                            
                            response.type = "New-Connection";
                            response.contents = {"nick":nickname};
                            broadcastResponse(connectionList, JSON.stringify(response)); 

							break;
							case "compile":
							response.type = "Compile-Running-Status";
							console.log("Received command to compile!");
							response.contents = {"nick": nickname, "output": ideFS.compile(file, params, dir), "file" : file, "dir" : dir};
							//ws.send(JSON.stringify(response));
              broadcastResponse(connectionList, JSON.stringify(response));
							break;
						case "run":
							response.type = "Code-Running-Status";
							console.log("Running code...");
							var str = ideFS.run(file, params, dir);
							console.log(str);
							response.contents = {"output": str};
							ws.send(JSON.stringify(response));
							break;
						case "message":
							response.type = "Message-Broadcast";
							response.contents = nickname + ": " + params;
							console.log("Received chat message from user '" + nickname + "': " + params);
							broadcastResponse(connectionList, JSON.stringify(response));
							break;
						case "newproject":
							response.type = "Project-Created-Status";
							if(!ideFS.createProject(global.appRoot + "/Workspace/" + params))
							{
								response.contents = {"Created": false, "Reason": "Failed to create a new project with the name '" + params + "'! That project name is already taken."};
							}
							else
							{
                                ideFS.explorerNew(explorer,'/',params);
							    response.contents = {"Created": true, "Files":explorer, "name": params,"nick": nickname};
							}
              broadcastResponse(connectionList, JSON.stringify(response));
							//ws.send(JSON.stringify(response));
							break;
						case "newfile":
							response.type = "File-Created-Status";
                            var newf = ideFS.createFile(params,dir);
							if(typeof(newf) == 'boolean')
							{
								response.contents = {"Created": false, "Reason": "Failed to create a new file with the name '" + params + "'! That file already exists in the current project."};
							}
							else
							{
                                ideFS.explorerNew(explorer, dir, params);
								response.contents = {"Created": true, "Content": newf,"nick":nickname, "path": dir, "name": params, "Files":explorer};
								rtu.newfile(dir + params, newf);
							}
              broadcastResponse(connectionList, JSON.stringify(response));
							//ws.send(JSON.stringify(response));
							break;
						case "deletefile":
							response.type = "File-Deleted-Status";
							if(!ideFS.deleteFile(params))
							{
								response.contents = {"Deleted": false, "Reason": "Failed to remove file '" + params + "'"};
							}
							else
							{
								var split = params.split('/');
								response.contents = {"Deleted": true, "proj": split[0], "file": split[1]};
							}
							ws.send(JSON.stringify(response));
							break;
						case "newdir":
							response.type = "Directory-Created-Status";
							if(!ideFS.createDirectory(params))
							{
								response.contents = {"Created": false, "Reason": "Failed to create a new directory with the name '" + params + "'! That file already exists in the current project."};
							}
							else
							{
                                var split = params.split('/');
                                var dirName = split[split.length-1];
                                split.pop();
                                var path = split.join("/")+'/';
                                console.log("New Path after joining: " + path);
                                ideFS.explorerNew(explorer, path, dirName);
								response.contents = {"Created": true, "Files": explorer,  "dir": params+'/', "nick": nickname};

							}
              broadcastResponse(connectionList, JSON.stringify(response));
							//ws.send(JSON.stringify(response));
							break;
						case "openfile":
							response.type = "File-Open-Response";
							var files = ideFS.getProjectFiles(dir);
							if(files != null)
							{
								response.contents = {"Opened": true, "Dir": dir, "Files": files};
							}
							else
							{
								response.contents = {"Opened": false};
							}
							ws.send(JSON.stringify(response));
							break;
						case "gotupdate":
							rtu.incqstate(dir + file, nickname); // this guy is up to date
							break;
						case "rtu":
							response.type = "RTU-Got-Message";
							ws.send(JSON.stringify(response)); // ack

							var fpath = dir + file;
							change = rtu.adjustchange(fpath, nickname, change); // adjust
							rtu.enQ(fpath, change); // log
							rtu.bufwrite(fpath, change); // update buffer

							var bc =
							{
								"type": "RTU-Broadcast",
								"nickname": nickname,
								"dir": dir,
								"file": file,
								"contents": change
							};
							broadcastResponse(connectionList, JSON.stringify(bc)); // send out
							break;
						case "readfile":
							response.type = "Read-File";
							var str = fs.readFileSync(global.appRoot + "/Workspace/" + dir + params, "utf8").toString();
							response.contents = {"body": str, "proj": dir, "file": params};
							ws.send(JSON.stringify(response));
						
							rtu.readfile(nickname, dir + params, str);
							break;
						case "git_init":
							response.type = "Git";
							var initial = git.init(dir).toString();
							response.contents = {"Message": initial};
							ws.send(JSON.stringify(response));
							console.log(initial);
							break;
						case "git_addremote":
							response.type = "Git";
							var remote = git.addremote(dir, params.split(' ')[0], params.split(' ')[1]).toString();
							response.contents = {"Message": remote};
							ws.send(JSON.stringify(response));
							console.log(remote);
							break;
						case "git_clone":
							response.type = "Git";
							var clone = git.clone(dir,params,token).toString();
							response.contents = {"Message": clone};
							ws.send(JSON.stringify(response));
							console.log(clone);
							break;
						case "git_pull":
							response.type = "Git";
							var pull = git.pull(params, dir).toString();
							response.contents = {"Message": pull};
							ws.send(JSON.stringify(response));
							console.log(pull);
							break;
						case "git_add":
							response.type = "Git";
							var add = git.add(params, dir).toString();
							response.contents = {"Message": add};
							ws.send(JSON.stringify(response));
							console.log(add);
							break;
						case "git_commit":
							response.type = "Git";
							var commit = git.commit(params, dir).toString();
							response.contents = {"Message": commit};
							ws.send(JSON.stringify(response));
							console.log(commit);
							break;
						case "git_push":
							response.type = "Git";//needs to be sent
							var globalname = git.setName(connectionList[connind].name,dir).toString();
							var globalemail = git.setEmail(connectionList[connind].email,dir).toString();
							var push = git.push(dir, token, params.split(' ')[0], params.split(' ')[1]).toString();
							response.contents = {"Message": globalname + "\n" + globalemail + "\n" + push};
							ws.send(JSON.stringify(response));
							console.log(git.push(dir, token, params.split(' ')[0], params.split(' ')[1]).toString());
							break;
						case "git_auth":
							response.type = "Git-auth";
							git.requestToken(params, git.storeToken, connectionList, connind);
							response.contents = {"Message": "Authentication complete"};
							ws.send(JSON.stringify(response));
							break;
						default:
							response.type = "Error";
							response.contents = "Unrecognized command '" + command  + "'!";
							break;
					}
				}
				else //People without valid nicknames cannot issue commands other than "connect", which sets their nickname
				{
					console.log("The user that issued the given command was unrecognized!");
				}
			}
			catch(err)
			{
				response.type = "Error";
				response.contents = "The message received did not match the proper protocol!\n Message: " + message + "\nExact error: " + err;
				console.log(err);
			}
		});
		ws.on('close', function()
		{
            var response = {type:null, contents};
            var response.type = "Disconnected";
			var found = false;
			connectionList.forEach(function(conn)
			{
				if(conn.connection == ws) //Find which client disconnected, and remove them from connectionList
				{
                    response.contents = {"nick":conn.nick};
					found = true;
					console.log("User '" + conn.nickname  + "' has disconnected!");
					connectionList.splice(connectionList.indexOf(conn), 1);
				}
			});
			if(!found) //The client that disconnected never got added to the connectionList (they never provided a valid nickname)
			{
				console.log("An unknown client disconnected!");
			}
            broadcastResponse(connectionList, JSON.stringify(response));
		});
	});
}
//End of runServer function

//Actual code that creates the server is from here on down

if(!ideFS.configExists()) //Create a server.conf file (to store certain server settings) if one does not already exist
{
	ideFS.createConfig();
}

ideFS.readConfig(); //Read certain settings from the server.conf file and store them in memory

if(!ideFS.workspaceExists()) //Create a Workspace folder (which will contain all projects created on the server) if one does not already exist
{
	ideFS.createWorkspace();
}

runServer(ideFS.getConfigObj().port); //Run the server
