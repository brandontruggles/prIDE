
var fn = (function ()
{
	return {
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
			console.log("gets here");
			currproject = name;
			var curdir = document.getElementById(name);
			curdir.style.backgroundColor = "#FDFF47";
			//curdir.innerHTML = currproject;
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
				"dir": projects[currfolder].path,
				"contents": "compile"
			};
			sock.send(JSON.stringify(message));
		},
		newproject : function ()
		{
			name = document.getElementById('name').value;
			var message =
			{
				"nickname": nickname,
				"contents": "newproject "+name
			};
			setproj(name);
			sock.send(JSON.stringify(message));
		},
		newfolder : function()
		{//work in progress
			console.log(currproject);
			name = document.getElementById('name').value;
			var message =
			{
				"nickname": nickname,
				"contents": "newproject "+projects[currfolder].path+"/"+name
			};

			sock.send(JSON.stringify(message));

		},
		newfile : function ()
		{
			name = document.getElementById('name').value;
			var message =
			{
				"nickname": nickname,
				"dir": projects[currfolder].path,
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
				alert("printing important");
				chatbox.value = parseInt(chatbox.value.split(' ')[1]);
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
		chat : function ()
		{
			var chatbox = document.getElementById('chat');
			var message;
			message =
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "message "+chatbox.value
			};
			chatbox.value = '';
			sock.send(JSON.stringify(message));
		},
		chatkeydown : function (e)
		{
			if (event.keyCode == 13)
			{
				var tag = document.activeElement.id;
				if(tag == "commandArea")
					this.message();
				else if (tag == "nick" || tag == "port" || tag == "ip")
					Connection();
				else if (tag == "chat")
					this.chat();
				else if (tag == "name")
					Creation();
			}
		},
		newdir : function ()
		{
			name = document.getElementById('name').value;
			var message =
			{
				"nickname": nickname,
				"contents": "newdir "+projects[currfolder].path+"/"+name
			};


			setproj(name);
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
		gitinit : function()
		{
			var message =
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "git_init"
			};
			sock.send(JSON.stringify(message));
		},
		gitaddremote: function()
		{
			var remoteName = "";
			var url = "";
			var message =
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "git_addremote " + remoteName + " " + url
			};
			sock.send(JSON.stringify(message));
		},
		gitpush : function ()
		{
			var url = "";
			var branchName = "";
			var message =
			{
				"nickname": nickname,
				"dir": currproject,
				"contents": "git_push " + url + " " + branchName
			};
			sock.send(JSON.stringify(message));
		},
		gitcommit : function ()
		{
			var msg = document.getElementById('name').value;
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
			var url = document.getElementById('name').value;
			var message =
			{
				"nickname": nickname,
				"contents": "git_clone " + url
			};
			sock.send(JSON.stringify(message));
		},
		gitauth:function()
		{
			var win = window.open("https://github.com/login/oauth/authorize?client_id=a0529985d128d88ea4b7&scope=repo", "GitHub Authentication", "width=400,height=500");
			win.focus();
		},
		processAuth:function(params)
		{
			params = params.replace("?code=","");
			var message =
			{
				"nickname": nickname,
				"contents": "git_auth " + params
			};
			sock.send(JSON.stringify(message));
		}
	};
}());
