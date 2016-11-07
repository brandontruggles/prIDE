var sock;
var nickname;
var currfile;
var currproject;
var name;
var editor;
var curtab;
var projects = {};
var tabs = [];
var updateflag = true;
var vim = false;

//real time update
var currow = -1;
var currindex = -1;
var change = "";

function Connection()//works
{
    editor = ace.edit("codespace");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/java");
	  editor.setKeyboardHandler("ace/keyboard/vim");
	  //editor.on("change", Update);
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
				updateFileExplorer(); // pre-load some files
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
					updateFileExplorer();
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
					projects[currproject].filelist = projects[currproject].filelist.concat([currfile]);

					if (currfile.endsWith(".java")){
							tabs = tabs.concat([{
								"projname": currproject,
								"filename":	currfile,
								"body": "public class "+currfile.substr(0,currfile.length-5)+"\n{\n\tpublic static void main(String[] args)\n\t{\n\t\t// Edit this class as you please\n\t\tSystem.out.println(\"Hello World!\");\n\t}\n}\n",
								"cursor": {"row": 4, "column": 2}
              }]);
          }
					else
							tabs = tabs.concat([{
								"projname": currproject,
								"filename":	currfile,
								"body": "",
								"cursor": {"row": 0, "column": 0}
								}]);


					updateTabs();
					updateFileExplorer();

					if (tabs.length == 1) curtab = 0;
					gototab(0);
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
					updateFileExplorer();
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
					updateFileExplorer();
				}
				else{
					//alert("no projects make one");
				}
				break;
			case "File-Update-Response":
				editor.setValue(contents.file_contents);
    				editor.clearSelection();
				break;
			case "Read-File":
				/* vvv kinda jank to do this here vvv */
				tabs = tabs.concat([{
						"projname": contents.proj,
						"filename":	contents.file,
						"body": contents.body,
						"cursor": {"row": 0, "column": 0}
						}]);
				updateTabs();
				updateFileExplorer(); // now it switches to tab instead of opening a new one
				gototab(tabs.length - 1);
				break;

			default:
				break;
		}//switch
	}//onmessage
}

function gototab(num)
{
	var oldtab = curtab;
	var cursor = editor.getCursorPosition();
	curtab = num;
	setproj(tabs[num].projname);
	currfile = tabs[num].filename;
	updateflag = false;
	editor.setValue(tabs[num].body);
	updateflag = true;
	editor.moveCursorToPosition(tabs[num].cursor);
	editor.clearSelection();
	editor.focus();
	if (tabs[oldtab])
		tabs[oldtab].cursor = cursor;

	updateTabs(); //for bg color
}

function tabforward() {
	if (curtab + 1 == tabs.length)
		gototab(0);
	else
		gototab(curtab + 1);
}

function opennewtab(proj, file) {
	var message = {
		"nickname": nickname,
		"dir": proj,
		"contents": "readfile " + file
	}
	sock.send(JSON.stringify(message));
	return;
}

function closetab(index) {
	if (tabs.length == 1) return; // temporary to prevent errors
	tabs.splice(index, 1);
	if (curtab >= index) {
		if (curtab != 0)
			curtab --;
		setproj(tabs[curtab].projname);
		currfile = tabs[curtab].filename;
		updateflag = false;
		editor.setValue(tabs[curtab].body);
		updateflag = true;
		editor.moveCursorToPosition(tabs[curtab].cursor);
		editor.clearSelection();
	}
	updateTabs();
	updateFileExplorer();
}

function movetab(src, dst) {
	if (src > dst) {
		tabs.splice(dst, 0, tabs[src]);
		tabs.splice(src+1, 1);
	}
	else {
		tabs.splice(dst+1, 0, tabs[src]);
		tabs.splice(src, 1);
	}
	if (src < curtab && curtab <= dst)
		curtab --;
	else if (src > curtab && curtab >= dst)
		curtab ++;
	else if (src == curtab)
		curtab = dst;
	updateTabs();
	updateFileExplorer();
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

function togglecollapse(proj) {
	setproj(proj);
	projects[proj].hidden = !projects[proj].hidden;
	updateFileExplorer();
}

function updateFileExplorer() {
	var fileList = document.getElementById('openproj');
	var str = '';
	for (var key in projects) {
		if (!projects.hasOwnProperty(key)) continue;
		if (projects[key].hidden) {
			str += '<option value="'+key+'" onclick="togglecollapse(\''+key+'\')">+ '+key+'</option>';
			continue;
		}
		str += '<option value="'+key+'" onclick="togglecollapse(\''+key+'\')">- '+key+'</option>';
		for (var j = 0; j < projects[key].filelist.length; j++) {
			var t = -1;
			for (var k = 0; k < tabs.length; k++)
				if (tabs[k].projname == key && tabs[k].filename == projects[key].filelist[j]) {
					t = k;
					break;
				}
			if (t == -1)
				str += '<option value="'+projects[key].filelist[j]+'" onclick="opennewtab(\''+key+'\', \''+projects[key].filelist[j]+'\')">'+projects[key].filelist[j]+'</option>';
			else
				str += '<option value="'+projects[key].filelist[j]+'" onclick="gototab('+t+')">'+projects[key].filelist[j]+'</option>';
		}
	}
	fileList.innerHTML = str;
}

function updateTabs() {
	var tabList = document.getElementById('tabs');
	var str = ''
	for (var i = 0; i < tabs.length; i++) {
		if (i != curtab)
			str += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+i+'" onclick="gototab('+i+')">'+tabs[i].filename+'</a></li>';
		else
			str += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+i+'" onclick="gototab('+i+')" style="background-color: gray;">'+tabs[i].filename+'</a></li>';
	}
	tabList.innerHTML = str;
}

function setproj(name) {
	currproject = name;
	var curdir = document.getElementById('curdir');
	curdir.innerHTML = currproject;
}

function setfile(name) {
	currfile = name;
}

function ch(event){
  var key = event.keyCode || event.charCode;

  if(key == 8)
    change+="#b"
  else if (key == 13)
    change+="\n"
  else {
    return;
  }
}

function changes(event){
  var key = event.keyCode || event.charCode;
  var cursor = editor.selection.getCursor();
  if(currindex == -1){
    currow = cursor.row+1;
    currindex = cursor.column;
  }

    change+=String.fromCharCode(key);
}

function Update()
{
	if (! updateflag) return;
  if (change == "" || change == null)
    return;
	var message = {
		"nickname": nickname,
		"dir": currproject,
    "file": currfile,
		"contents": "updatefile "+currow+ " "+currindex+" "+change
	};
	sock.send(JSON.stringify(message));
  currow = -1;
  currindex = -1;
  change = "";
}
setInterval(Update, 1000);

function compile()//hold on for alec
{
	Update();
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
		closetab(parseInt(chatbox.value.split(' ')[1]));
		chatbox.value = '';
		return;
	}
	else if (chatbox.value.startsWith("/movetab")) {
		movetab(parseInt(chatbox.value.split(' ')[1]), parseInt(chatbox.value.split(' ')[2]));
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
