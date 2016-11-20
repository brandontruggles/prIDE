
var fn = (function () 
{
	return 
	{
		deletefile : function (file) 
		{
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "deletefile " + file
			};
			sock.send(JSON.stringify(message));
		},
		deleteproj : function (proj) 
		{
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "deleteproj " + proj
			};
			sock.send(JSON.stringify(message));
		},
		setproj : function (name) 
		{
			currproject = name;
			var curdir = document.getElementById('curdir');
			curdir.innerHTML = currproject;
		},
		setfile : function (name) 
		{
			currfile = name;
		},
		compile : function ()
		{
			//Update();
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "compile"
			};
			sock.send(JSON.stringify(message));
		},
		newproject : function ()
		{
			name = prompt("name of project");
			var message = 
			{
				"nickname": nickname,
				"contents": "newproject "+name
			};
			setproj(name);
			sock.send(JSON.stringify(message));
		},
		newfile : function ()
		{
			name = prompt("name file");
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "newfile "+name
			};
			sock.send(JSON.stringify(message));
		},
		getfilecontents : function (params) 
		{
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "readfile " + params
			};
			sock.send(JSON.stringify(message));
		},
		message : function ()
		{//for chat
			var chatbox = document.getElementById('commandArea');
			var message;
			if (chatbox.value.startsWith("/closetab")) 
			{
				ide.closetab(parseInt(chatbox.value.split(' ')[1]));
				chatbox.value = '';
				return;
			}
			else if (chatbox.value.startsWith("/movetab")) 
			{
				ide.movetab(parseInt(chatbox.value.split(' ')[1]), parseInt(chatbox.value.split(' ')[2]));
				chatbox.value = '';
				return;
			}
			else if (chatbox.value.startsWith("/"))
			{
				message = 
				{
					"nickname": nickname,
					"dir": currproject,
					"contents": chatbox.value.substr(1)
				};
			}
			else
			{
				message = 
				{
					"nickname": nickname,
					"dir": currproject,
					"contents": "message "+chatbox.value
				};
			}
			chatbox.value = '';
			sock.send(JSON.stringify(message));
		},
		chatkeydown : function (e)
		{
			if (event.keyCode == 13) 
			{
				this.message();
			}
		},
		newdir : function ()
		{
			var name = prompt("name new directory");
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "newdir "+ name
			};
			sock.send(JSON.stringify(message));
		},
		openproject : function ()
		{
			var message = 
			{
				"nickname": nickname,
				"contents": "openproject"
			};
			sock.send(JSON.stringify(message));
		},
		getfiles : function (dir)
		{
			var message = 
			{
				"nickname": nickname,
				"dir": dir,
				"contents": "openfile"
			};
			sock.send(JSON.stringify(message));
		},
		run : function ()
		{
			var message = 
			{
				"nickname": nickname,
				"file": currfile,
				"dir": currproject,
				"contents": "run"
			};
			sock.send(JSON.stringify(message));
		},
		gitpush : function () 
		{
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "git_push"
			};
			sock.send(JSON.stringify(message));
		},
		gitcommit : function () 
		{
			var msg = prompt("message: ");
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "git_commit " + msg
			};
			sock.send(JSON.stringify(message));
		},
		gitadd : function () 
		{
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "git_add " + currfile
			};
			sock.send(JSON.stringify(message));
		},
		gitclone : function () 
		{
			var url = prompt("url: ");
			var message = 
			{
				"nickname": nickname,
				"contents": "git_clone " + url
			};
			sock.send(JSON.stringify(message));
		}
	};
}());

