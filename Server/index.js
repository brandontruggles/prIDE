var rtu = require('./rtu.js');
var git = require('./git.js');
var ideFS = require('./ideFS.js');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

function explorerCreator(explorer, proj, curpath, pathing)
{//finished i think working as intended
	var newproj = [];
	for(var dir in proj){
		explorer.push(ideFS.getProjectFiles(curpath+proj[dir]));
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
		if(newproj.length != 0){
			explorerCreator(explorer,newproj,curpath+proj[dir]+'/', pathing);
			newproj = [];
		}
		else {
			//return;
		}
	}//completed array
	return;
}

function storeGitInfo(infoObj, connectionList, connind)
{
	connectionList[connind].name = infoObj.name;
	connectionList[connind].email = infoObj.email;
}

function storeGitToken(token, connectionList, connind)
{
	connectionList[connind].token = token;
	git.requestUserInfo(token, storeGitInfo, connectionList, connind);
}

function broadcastResponse(connectionList, responseString)
{
	connectionList.forEach(function(conn)
	{
		conn.connection.send(responseString);
	});
}

function runServer(portNumber)
{
	console.log("Running the IDE server on port " + portNumber + "...");
	var server = new WebSocketServer({port: portNumber});
	var connectionList = [];
	var connind = -1;
	server.on('connection', function connection(ws)
	{
		console.log('New connection attempted!');
		ws.on('message', function incoming(message)
		{
			console.log('received: %s', message);
			var response = {"type": "", "contents": null};
			try
			{
				var json_message = JSON.parse(message);
				var nickname = json_message.nickname;
				var contents = json_message.contents;
				var file = json_message.file;
				var dir = json_message.dir;
				var change = json_message.change;
				var command = contents.split(' ')[0].toLowerCase();
				var spaceIndex = contents.indexOf(' ');
				var params = contents.substring(spaceIndex + 1);				var token = null;

				var found = false;
				connectionList.forEach(function(conn)
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
					switch(command)
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
								var proj = fs.readdirSync("workspace/");
								var curpath = '';
								var explorer;
								var pathing;
								explorerCreator(explorer = [],proj, curpath, pathing=[]);
								for(var k in explorer)
									console.log(explorer[k]);
								connectionList.push({"connection":ws,"nickname":nickname,"token":null,"name":null,"email":null});
								response.contents = {"Accepted": true, "Proj":proj, "Files": explorer, "paths": pathing};
								console.log("Accepted incoming connection from user '"+ nickname  +"'.");
							}
							ws.send(JSON.stringify(response));
							break;
							case "compile":
							response.type = "Compile-Running-Status";
							console.log("Received command to compile!");
							response.contents = {"output": ideFS.compile(dir)};
							ws.send(JSON.stringify(response));
							break;
						case "run":
							response.type = "Code-Running-Status";
							console.log("Running code...");
							var str = ideFS.run(file, "some args", dir);
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
							if(!ideFS.createProject("workspace/" + params))
							{
								response.contents = {"Created": false, "Reason": "Failed to create a new project with the name '" + params + "'! That project name is already taken."};
							}
							else
							{
									response.contents = {"Created": true, "Folder": false};

							}
							ws.send(JSON.stringify(response));
							break;
						case "newfile":
							response.type = "File-Created-Status";
							if(!ideFS.createFile(params, dir))
							{
								response.contents = {"Created": false, "Reason": "Failed to create a new file with the name '" + params + "'! That file already exists in the current project."};
							}
							else
							{
								response.contents = {"Created": true};
								var startContents = "public class " + params.replace(".java", "") + "\n{\n\tpublic static void main(String[] args)\n\t{\n\t\t// Edit this class as you please\n\t\tSystem.out.println(\"Hello World!\");\n\t}\n}"
								rtu.newfile(dir + "/" + params, startContents);
							}
							ws.send(JSON.stringify(response));
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
								console.log(split[0]);
								console.log(split[1]);
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
									var proj = fs.readdirSync("workspace/");
									var curpath = '';
									var explorer;
									var pathing;
									explorerCreator(explorer = [],proj, curpath, pathing=[]);
									for(var k in explorer)
										console.log(explorer[k]);
									for(var k in pathing)
										console.log(pathing[k]);
									response.contents = {"Created": true, "Proj":proj, "Files": explorer, "paths": pathing};

							}
							ws.send(JSON.stringify(response));
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
							incqstate(dir + "/" + file, nickname); // this guy is up to date
							break;
						case "rtu":
							response.type = "RTU-Got-Message";
							ws.send(JSON.stringify(response)); // ack

							var fpath = dir + "/" + file;
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
							var str = fs.readFileSync("workspace/" + dir + "/" + params, "utf8").toString();
							response.contents = {"body": str, "proj": dir, "file": params};
							ws.send(JSON.stringify(response));
							rtu.readfile(nickname, dir + "/" + params, str);
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
							var clone = git.clone(params,token).toString();
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
							var globalname = git.setName(connectionList[connind.name]).toString();
							var globalemail = git.setEmail(connectionList[connind.email]).toString();
							var push = git.push(dir, token, params.split(' ')[0], params.split(' ')[1]).toString();
							response.contents = {"Message": globalname + "\n" + globalemail + "\n" + push};
							ws.send(JSON.stringify(response));
							console.log(git.push(dir, token, params.split(' ')[0], params.split(' ')[1]).toString());
							break;
						case "git_auth":
							git.requestToken(params,storeGitToken, connectionList, connind);
							break;
						default:
							response.type = "Error";
							response.contents = "Unrecognized command '" + command  + "'!";
							break;
					}
				}
				else
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
			var found = false;
			connectionList.forEach(function(conn)
			{
				if(conn.connection == ws)
				{
					found = true;
					console.log("User '" + conn.nickname  + "' has disconnected!");
					connectionList.splice(connectionList.indexOf(conn), 1);
				}
			});
			if(!found)
			{
				console.log("An unknown client disconnected!");
			}
		});
	});
}

if(!ideFS.configExists())
{
	ideFS.createConfig();
}

ideFS.readConfig();

if(!ideFS.workspaceExists())
{
	ideFS.createWorkspace();
}

runServer(ideFS.getConfigObj().port);
