var sock;
var nickname;
var currfile;
var currproject;
var currfolder = "";
var name;
var editor;
var paths = {};
var projects = {};

function Connection()//works
{
	editor = ace.edit("codespace");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/java");
	editor.setReadOnly(true);
	editor.setKeyboardHandler("ace/keyboard/vim");
	editor.on("change", Update);
	editor.$blockScrolling = Infinity;
	editor.commands.addCommand({ // adding commands doesn't work
		name:	'testcommand',
		bindkey:
		{
			sender:	'editor|cli',
			win:	'Ctrl-Alt-h'
		},
		exec:	function(editor)
		{
			alert("ctrl");
			console.log("ctrl");
		}
	});
	/*
	ace.config.loadModule("ace/keyboard/vim", function(m)
	{
		var VimApi = require("ace/keyboard/vim").CodeMirror.Vim;
			VimApi.defineEx("write", "w", function(cm, input)
			{
				cm.ace.execCommand("save");
			});
	});
	editor.commands.addCommand({
	   name: 'tabforward',
	   bindKey:
	   {
		win: 'Ctrl-Q',
		mac: 'Command-Q'
	   },
	   exec: tabforward,
	   readonly: true
	});
	   */
	editor.resize();
	nickname = document.getElementById('nick').value;
	var port = document.getElementById('port').value;
	var ip = document.getElementById('ip').value;

	if(nickname == '')
		document.getElementById('wrong_port').textContent = 'Invalid Username!';
	else{

	try {

			if(ip == "")
  				sock = new WebSocket("ws://45.55.218.73:"+port);
  			else {
 				sock = new WebSocket('ws://'+ip+":"+port);
  			}

			if(document.getElementById('wrong_port'))
			{
				document.getElementById('error').style.display = 'none';
				document.getElementById('error').innerHTML = "";
			}

			sock.onerror = function()
			{
				document.getElementById('wrong_port').textContent = 'Invalid Server Name!';
			};
			sock.onclose = function()
			{
				if(document.getElementById('Loader').style.display != 'block')
					document.getElementById('consoleWindow').innerHTML += "Lost Connection to Server!";
			};
			sock.onopen = function()
			{
				var connect =
				{
					"nickname": nickname,
					"contents": "connect"
				};
				sock.send(JSON.stringify(connect));
			};
			sock.onmessage = function(response)
			{
				var res = JSON.parse(response.data);
				var contents = res.contents;
				switch(res.type)
				{
					case "Console":
						console.log(contents);
						document.getElementById('consoleWindow').innerHTML += contents;
						break;
					case "Connection-Accept":
						if(contents.Accepted)
						{
							document.getElementById('Loader').style.display = 'none';
							//document.getElementById('Loader').innerHTML = "";
							document.getElementById('main-container').style.display = 'block' ;

							createSolution(contents);


							ide.updateFileExplorer();
						}
						else
						{
							document.getElementById('wrong_port').innerHTML = contents.Reason;
						}
						// pre-load some files
						break;
					case "RTU-Broadcast":
						if (res.nickname == nickname)
						{
							break;
						}
						rtu.rcv(res.dir, res.file, contents);
						break;
					case "Compile-Running-Status":
						if(contents.output[0] == null)
						{
							document.getElementById('consoleWindow').innerHTML += 'Successfully Compiled\n';
						}
						else
						{
							document.getElementById('consoleWindow').innerHTML += contents.output;
						}
						break;
					case "Code-Running-Status":
						document.getElementById('consoleWindow').innerHTML += contents.output;
						break;//needs code
					case "Message-Broadcast":
						document.getElementById('chatWindow').innerHTML += contents+"\n";
						break;
					case "Project-Created-Status":
						if(contents.Created)
						{
							projects[name] = {"hidden": false, "filelist": [], "path": name};//work in progress
							setproj(name);
							ide.updateFileExplorer();

							reset();

						}
						else
						{
							document.getElementById('consoleWindow').innerHTML += contents.Reason;
						}
						break;
					case "File-Created-Status":
						var numOfFiles = 0;
						if(contents.Created)
						{
							currfile = name;
							projects[currfolder].filelist.push(currfile);

							if (currfile.endsWith(".java"))
							{
								ide.addtab(currproject, currfile, "public class "+currfile.substr(0,currfile.length-5)+"\n{\n\tpublic static void main(String[] args)\n\t{\n\t\t// Edit this class as you please\n\t\tSystem.out.println(\"Hello World!\");\n\t}\n}\n", "ace/mode/java");
							}
							else
							{
								ide.addtab(currproject, currfile, "", "ace/mode/text");
							}

							ide.updateTabs();
							ide.updateFileExplorer();

							ide.gotolasttab();
							reset();
						}
						else
						{
							document.getElementById('consoleWindow').innerHTML += contents;
						}
						break;
					case "File-Deleted-Status":
						if (contents.Deleted)
						{
							var proj = contents.proj;
							var file = contents.file;
							var list = projects[proj].filelist;
							//projects[proj].filelist.splice(projects[proj].filelist.indexOf(file), 1);
							list.splice(list.indexOf(file), 1);
							ide.updateFileExplorer();

							reset();

						}
						else
						{
							document.getElementById('consoleWindow').innerHTML += contents;
						}
						break;
					case "Directory-Created-Status":
						if(contents.Created)
						{
							//adding to project
							createSolution(contents);
							setproj(name);
							console.log(name);
							ide.updateFileExplorer();

							reset();
						}
						else
						{
							document.getElementById('consoleWindow').innerHTML += contents.Reason;
						}
						break;
					case "File-Open-Response":
						if(contents.Opened)
						{
							projects[contents.Dir] = {"hidden": false, "filelist": contents.Files, "path": ''};//work in progress
							ide.updateFileExplorer();
						}
						else
						{
							//alert("no projects make one");
						}
						break;
					case "File-Update-Response":
						var cursor = editor.getCursorPosition();
						editor.setValue(contents.file_contents);
						console.log(cursor.row);
						editor.moveCursorToPosition(cursor);
						editor.clearSelection();
						currow = -1;
						currindex = -1;
						change = "";
						break;
					case "Read-File":
						/* vvv kinda jank to do this here vvv */
						ide.addtab(contents.proj, contents.file, contents.body, "ace/mode/java");
						ide.updateTabs();
						ide.updateFileExplorer(); // now it switches to tab instead of opening a new one
						ide.gotolasttab();
						break;
					case "Git":
						document.getElementById('consoleWindow').innerHTML += contents.Message;
						reset();
						break;

					case "Git-Clone-Made":
						document.getElementById('consoleWindow').innerHTML += contents.Message;
						reset();
						break;
					case "Git-Commit-Created":
						document.getElementById('consoleWindow').innerHTML += contents.Message;
						reset();
						break;
					case "Git-Push":
						document.getElementById('consoleWindow').innerHTML += contents.Message;
						reset();
						break;
					case "Git-pull":
						document.getElementById('consoleWindow').innerHTML += contents.Message;
						reset();
					default:
						break;
				}//switch
			}//onmessage

		}//try
		catch (e) {
				document.getElementById('wrong_port').textContent = 'Invalid Server Name!';
		}
	}
}

function setproj(name)
{
	if(document.getElementById(name))
	{
		if(document.getElementById(name).value.includes('/'))
		{
			currfolder = name;
		}

		else {
			currfolder = name;
			currproject = name;
		}

	}
	else {
		currfolder = name;
		currproject = name;

	}
}

function setfile(name)
{
	currfile = name;
}

function Update(e)
{
	rtu.Update(e);
}


function createSolution(contents)
{
	var count = 0;
	for(var i = 0; i < contents.Proj.length; i++)
	{
			projects[contents.Proj[i]] = {"hidden": true, "filelist": [], "path": contents.paths[count]};
			projects[contents.Proj[i]].filelist = contents.Files[count];

		count = solutionexplorer(count,contents.Proj[i], contents);
		count++;
	}

}

function solutionexplorer(count,projname,contents)
{//move this
	for( var k = 0; k < projects[projname].filelist.length; k++)
	{
		if(projects[projname].filelist[k].includes("/"))
		{
			count++;
			projects[contents.paths[count]] = {"hidden": true, "filelist": [],"path": contents.paths[count]};
			projects[contents.paths[count]].filelist = contents.Files[count];
			count = solutionexplorer(count,contents.paths[count], contents);
		}
		else {

		}
	}

	return count;
}
