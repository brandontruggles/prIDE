var sock;
var nickname;
var currfile;
var currproject;
var name;
var editor;
var projects = {};
var tabs = [];
var updateflag = true;

function Connection()//works
{
	editor = ace.edit("codespace");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/java");
	editor.setKeyboardHandler("ace/keyboard/vim");
	editor.on("change", Update);
	editor.$blockScrolling = Infinity;
	editor.commands.addCommand({ // adding commands doesn't work
		name:	'testcommand',
		bindkey:	{
			sender:	'editor|cli',
			win:	'Ctrl-Alt-h'
		},
		exec:	function(editor) {alert("ctrl");console.log("ctrl");}
	});
	/*
	   editor.commands.addCommand({
	   name: 'tabforward',
	   bindKey: {win: 'Ctrl-Q', mac: 'Command-Q'},
	   exec: tabforward,
	   readonly: true
	   });
	   */
	editor.resize();

	var port = prompt("Enter port");
	nickname = prompt("Enter nickname");
	sock = new WebSocket("ws://45.55.218.73:"+port);
	sock.onopen = function()
	{
		var connect = {
			"nickname": nickname,
			"contents": "connect"
		};
		sock.send(JSON.stringify(connect));

	};
	sock.onmessage = function(response){

		var res = JSON.parse(response.data);
		var contents = res.contents;
		switch(res.type){
			case "Console":
				console.log(contents);
				document.getElementById('consoleWindow').innerHTML += contents;
				break;
			case "Connection-Accept":
				if(contents.Accepted){
					//nickname = document.getElementById('nickname').value;
					//document.location.href = "IDEMain.html";
				}
				else{
					alert(contents.Reason);
					port = prompt("Enter port");
					nickname = prompt("Enter nickname");
					sock.close();
					sock = new WebSocket("ws://45.55.218.73:"+port);
				}
				ide.updateFileExplorer(); // pre-load some files
				break;
			case "RTU-Broadcast":
				if (res.nickname == nickname) break;
				if (res.dir != currproject || res.file != currfile) break;

				rtu.rcv(contents);
				break;
			case "Compile-Running-Status":
				if(contents.output[0] == null)
					document.getElementById('consoleWindow').innerHTML += 'Successfully Compiled\n';
				else {
					document.getElementById('consoleWindow').innerHTML += contents.output;
				}
				break;
			case "Code-Running-Status":
				document.getElementById('consoleWindow').innerHTML += contents.output;
				break;//needs code
			case "Message-Broadcast":
				document.getElementById('consoleWindow').innerHTML += contents+"\n";
				break;
			case "Project-Created-Status":
				if(contents.Created){
					alert("new project created");
					projects[name] = {"hidden": false, "filelist": []};
					ide.updateFileExplorer();
					setproj(name);
				}
				else{
					alert(contents.Reason);
				}
				break;
			case "File-Created-Status":
				var numOfFiles = 0;
				if(contents.Created){
					alert("new file created");
					currfile = name;
					projects[currproject].filelist.push(currfile);

					if (currfile.endsWith(".java")){
						tabs.push({
							"projname": currproject,
							"filename":	currfile,
							"body": "public class "+currfile.substr(0,currfile.length-5)+"\n{\n\tpublic static void main(String[] args)\n\t{\n\t\t// Edit this class as you please\n\t\tSystem.out.println(\"Hello World!\");\n\t}\n}\n",
							"cursor": {"row": 4, "column": 2}
						});
					}
					else
						tabs.push({
							"projname": currproject,
							"filename":	currfile,
							"body": "",
							"cursor": {"row": 0, "column": 0}
						});


					ide.updateTabs();
					ide.updateFileExplorer();

					if (tabs.length == 1) ide.settab(0);
					ide.gototab(0);
				}
				else{
					alert(contents.Reason);
				}
				break;
			case "File-Deleted-Status":
				if (contents.Deleted) {
					var proj = contents.proj;
					var file = contents.file;
					var list = projects[proj].filelist;
					//projects[proj].filelist.splice(projects[proj].filelist.indexOf(file), 1);
					list.splice(list.indexOf(file), 1);
					ide.updateFileExplorer();
				}
				else {
					alert(contents.Reason);
				}
				break;
			case "Directory-Created-Status":
				if(contents.Created){
					alert("directory created");
					var fileList = document.getElementById('openproj');
					fileList.innerHTML += '<li><a href="#">'+name+'/</a></li>';
				}
				else{
					alert(contents.Reason);
				}
				break;
			case "Project-Open-Response":
				if(contents.Opened){
					var str = '';
					for(var i = 0; i < contents.Files.length; i++){
						str += contents.Files[i] + "\n";
					}
					var dir = prompt(str);
					getfiles(dir);
					setproj(dir);
				}
				else{
					alert("no projects make one");
				}
				break;
			case "File-Open-Response":
				if(contents.Opened){
					projects[contents.Dir] = {"hidden": false, "filelist": contents.Files};
					ide.updateFileExplorer();
				}
				else{
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
				tabs.push({
					"projname": contents.proj,
					"filename":	contents.file,
					"body": contents.body,
					"cursor": {"row": 0, "column": 0}
				});
				ide.updateTabs();
				ide.updateFileExplorer(); // now it switches to tab instead of opening a new one
				ide.gototab(tabs.length - 1);
				break;

			default:
				break;
		}//switch
	}//onmessage
}

function deletefile(file) {
	var message = {
		"nickname": nickname,
		"dir": currproject,
		"contents": "deletefile " + file
	}
	sock.send(JSON.stringify(message));
}

function deleteproj(proj) {
	var message = {
		"nickname": nickname,
		"dir": currproject,
		"contents": "deleteproj " + proj
	}
	sock.send(JSON.stringify(message));
}

function setproj(name) {
	currproject = name;
	var curdir = document.getElementById('curdir');
	curdir.innerHTML = currproject;
}

function setfile(name) {
	currfile = name;
}

function compile()
{
	//Update();
	var message = {
		"nickname": nickname,
		"dir": currproject,
		"contents": "compile"
	}
	sock.send(JSON.stringify(message));
}

function newproject()//works
{
	name = prompt("name of project");
	var message = {
		"nickname": nickname,
		"contents": "newproject "+name
	}
	setproj(name);
	sock.send(JSON.stringify(message));
}

function newfile()//works
{
	name = prompt("name file");
	var message = {
		"nickname": nickname,
		"dir": currproject,
		"contents": "newfile "+name
	}
	sock.send(JSON.stringify(message));
}

function getfilecontents(params) {
	var message = {
		"nickname": nickname,
		"dir": currproject,
		"contents": "readfile " + params
	}
	sock.send(JSON.stringify(message));
}

function message()
{//for chat
	var chatbox = document.getElementById('commandArea');
	var message;
	if (chatbox.value.startsWith("/closetab")) {
		ide.closetab(parseInt(chatbox.value.split(' ')[1]));
		chatbox.value = '';
		return;
	}
	else if (chatbox.value.startsWith("/movetab")) {
		ide.movetab(parseInt(chatbox.value.split(' ')[1]), parseInt(chatbox.value.split(' ')[2]));
		chatbox.value = '';
		return;
	}
	else if (chatbox.value.startsWith("/"))
		message = {
			"nickname": nickname,
			"dir": currproject,
			"contents": chatbox.value.substr(1)
		}
	else
		message = {
			"nickname": nickname,
			"dir": currproject,
			"contents": "message "+chatbox.value
		}

	chatbox.value = '';
	sock.send(JSON.stringify(message));
}

function chatkeydown(e)
{
	if (event.keyCode == 13) message();
}


function newdir()//works
{
	var name = prompt("name new directory");
	var message = {
		"nickname": nickname,
		"dir": currproject,
		"contents": "newdir "+ name
	}
	sock.send(JSON.stringify(message));
}

function openproject()//works
{
	var message = {
		"nickname": nickname,
		"contents": "openproject"
	}
	sock.send(JSON.stringify(message));

}

function getfiles(dir)
{
	var message = {
		"nickname": nickname,
		"dir": dir,
		"contents": "openfile"
	}
	sock.send(JSON.stringify(message));

}

function run()
{
	var message = {
		"nickname": nickname,
		"file": currfile,
		"dir": currproject,
		"contents": "run"
	}
	sock.send(JSON.stringify(message));

}

function Update(e) { rtu.Update(e); }
