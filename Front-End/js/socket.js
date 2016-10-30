var sock;
var nickname;
var ntabs = 0;
var currfile;
var currproject;
var name;
var textareas = [];
var editor;
var cursors = [];
var curtab;
var projects = {};
var tabs = [];

function Connection()//works
{
    editor = ace.edit("codespace");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/java");
	editor.setKeyboardHandler("ace/keyboard/vim");
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
				break;
			case "Compile-Running-Status":
				if(contents.output[0] == null)
					document.getElementById('consoleWindow').innerHTML += 'Successfully Compiled\n';
				else {
					document.getElementById('consoleWindow').innerHTML += contents.output[0];
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
					var fileList = document.getElementById('openproj');
					fileList.innerHTML += '<option value="'+name+'" onclick="togglecollapse(\''+name+'\')">>'+name+'</option>';
					projects[name] = {"collapsed": false, "filelist": []};
					currproject = name;
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

					cursors = cursors.concat([0]);
					var fileList = document.getElementById('openproj');
					fileList.innerHTML += '<option value="'+name+'" onclick="gototab('+ntabs+')"" id="option'+ntabs+'">'+name+'</option>';

					var tabList = document.getElementById('tabs');
					tabList.innerHTML += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+ntabs+'" onclick="gototab('+ntabs+')">'+name+'</a></li>';
					projects[currproject].filelist += [currfile];
					tabs = tabs.concat([{"projname": currproject, "filename": currfile}]);
					textareas = textareas.concat(["public class "+currfile.replace(".java", "")+"\n{\n\tpublic static void main(String[] args)\n\t{\n\t\t//Your Code Here\n\t}\n}\n"]);
					curtab = ntabs;
					ntabs++;
				}
				else{
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
					var fileList = document.getElementById('openproj');
					fileList.innerHTML = '';//empty out file explorer
					for(var i = 0; i < contents.Files.length; i++){
						fileList.innerHTML += '<li><a href="#">'+contents.Files[i]+'</a></li>';
					}


				}
				else{
					alert("no projects make one");
				}
				break;
			case "File-Update-Response":
				document.getElementById('codespace').value = message;
				break;

			default:
				alert("dam son");
				break;
		}//switch
	}//onmessage
}

function gototab(num)
{
	currproject = tabs[num].projname;
	currfile = tabs[num].filename;
	editor.setValue(textareas[num]);
	curtab = num;
	document.getElementById("codespace").focus();
}

function tabforward() {
	if (curtab + 1 == ntabs)
		gototab('', 0);
	else
		gototab('', curtab + 1);
}

function togglecollapse(proj) {
	var hidden = projects[proj].hidden;
	if (hidden == "true")
		hidden = "false";
	else hidden = "true";
	var option;
	for (var i = 0; i < ntabs; i++) {
		option = document.getElementById('option'+i);
		if (tabs[i].projname == proj)
			if (hidden == "true")
				option.setAttribute("hidden", hidden);
			else
				option.removeAttribute("hidden");
	}
	projects[proj].hidden = hidden;
}

function setproj(name) {
	currproject = name;
}

function setfile(name) {
	currfile = name;
}

function Update()
{
	cursors[curtab] = editor.selection.getCursor();
	var message = {
		"nickname": nickname,
		"contents": "updatefile "+currfile+" "+editor.getValue()
	};
	sock.send(JSON.stringify(message));
	/*sock.onmessage = function(response){
	  var res = JSON.parse(response.data);
	  var message = res.contents;
	  document.getElementById('code').value = message;
	  }*/

}

function compile()//hold on for alec
{
	Update();
	var message = {
		"nickname": nickname,
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
	sock.send(JSON.stringify(message));

	/*sock.onmessage = function(response){
	  var res = JSON.parse(response.data);
	  var contents = res.contents;
	  if(contents.Created){
	  alert("new project created");
	  var fileList = document.getElementById('openproj');
	  fileList.innerHTML += '<li><a href="#">'+name+'/</a></li>';
	  currproject = name;


	  }
	  else{
	  alert(contents.Reason);
	  }
	  }*/
}

function newfile()//works
{
	name = prompt("name file");
	var message = {
		"nickname": nickname,
		"contents": "newfile "+name
	}
	sock.send(JSON.stringify(message));
	/*sock.onmessage = function(response){
	  var res = JSON.parse(response.data);
	  var contents = res.contents;
	  var numOfFiles = 0;
	  if(contents.Created){
	  alert("new file created");
	  currfile = name;

	  var textareas = document.getElementById("textareas");
	  textareas.innerHTML += "<div id=\"class"+ntabs+"\" class=\"tabcontent\">\n\
	  <ul id='openproj'>\n\
	  <li>Solution Explorer</li>\n\
	  </ul>\n\
	  \n\
	  \n\
	  <textarea rows=\"10\" cols=\"25\" id=\"codespace\" onkeydown=\"Update()\">\n\
	  public class Test "+ntabs+"\n\
	  {\n\
	  public static void main(String[] args)\n\
	  {\n\
	//Your Code Here\n\
	}\n\
	}</textarea>\n\
	<textarea placeholder=\"Console\" id=\"consoleWindow\" rows=\"20\" cols=\"25\"></textarea>\n\
	</div>\n\
	";
	var fileList = document.getElementById('openproj');
	//if(num)
	//var tab1 = document.getElementById('tab1');
	fileList.innerHTML += '<li><a href="#">'+name+'</a></li>';

	var tabList = document.getElementById('tabs');
	//var class4 = document.getElementById('class4');
	//class4String = '
	//tab1.innerHTML = name;
	tabList.innerHTML += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+ntabs+'" onclick="openTab(event, \'class'+ntabs+'\')">'+name+'</a></li>';
	}
	else{
	alert(contents.Reason);
	}
	}*/
}

function message()
{//for chat
	var chatbox = document.getElementById('commandArea');
	var message = {
		"nickname": nickname,
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
		"contents": "newdir "+ name
	}
	sock.send(JSON.stringify(message));
	/*sock.onmessage = function(response){
	  var res = JSON.parse(response.data);
	  var contents = res.contents;
	  if(contents.Created){
	  alert("directory created");
	  var fileList = document.getElementById('openproj');
	  fileList.innerHTML += '<li><a href="#">'+name+'/</a></li>';
	  }
	  else{
	  alert(contents.Reason);
	  }
	  }*/
}

function openproject()//works
{
	var message = {
		"nickname": nickname,
		"contents": "openproject"
	}
	sock.send(JSON.stringify(message));
	/*sock.onmessage = function(response){
	  var res = JSON.parse(response.data);
	  var contents = res.contents;
	  if(contents.Opened){
	  var fileList = document.getElementById('openproj');
	  fileList.innerHTML = '';//empty out file explorer
	  for(var i = 0; i < contents.Files.length; i++){
	  fileList.innerHTML += '<li><a href="#">'+contents.Files[i]+'</a></li>';
	  }


	  }
	  else{
	  alert("no projects make one");
	  }

	  }*/

}

function run()
{
	var message = {
		"nickname": nickname,
		"contents": "run "
	}
	sock.send(JSON.stringify(message));

}
