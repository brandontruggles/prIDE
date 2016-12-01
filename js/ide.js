
var ide = (function ()
{
	var tabs = [];
	var curtab;

	return {
		settab : function (i)
		{
			curtab = i;
		},
		gettab : function ()
		{
			return curtab;
		},
		gototab : function (num)
		{
			setproj(tabs[num].projname);
			currfile = tabs[num].filename;
			curtab = num;

			editor.setSession(tabs[num].doc);
			editor.focus();

			this.updateTabs();
			
		},
		gotolasttab : function ()
		{
			this.gototab(tabs.length - 1);
		},
		tabforward : function ()
		{
			if (curtab + 1 == tabs.length)
			{
				this.gototab(0);
			}
			else
			{
				this.gototab(curtab + 1);
			}
		},
		addtab : function (dir, file, body, mode)
		{
			tabs.push({
				projname: dir,
				filename: file,
				doc: ace.createEditSession(body, mode)
			});
		},
		findtab : function (dir, file)
		{
			for (var i=0; i<tabs.length;i++)
			{
				if (tabs[i].projname == dir && tabs[i].filename == file)
				{
					return tabs[i].doc;
				}
			}
			return null;
		},
		opennewtab : function (proj, file)
		{
			var message =
			{
				"nickname": nickname,
				"dir": proj,
				"contents": "readfile " + file
			};
			sock.send(JSON.stringify(message));
			return;
		},
		closetab : function (index)
		{
			alert("inside closetab");
			if(isNaN(index))
				index = curtab;

			if (tabs.length == 1)
			{
				alert("returned");
				return; // temporary to prevent errors
			}
			tabs.splice(index, 1);
			if (curtab >= index)
			{
				if (curtab != 0)
				{
					curtab --;
				}
				setproj(tabs[curtab].projname);
				currfile = tabs[curtab].filename;

				editor.setSession(tabs[curtab].doc);
			}
			this.updateTabs();
			this.updateFileExplorer();
		},
		movetab : function (src, dst)
		{
			if (src > dst)
			{
				tabs.splice(dst, 0, tabs[src]);
				tabs.splice(src+1, 1);
			}
			else
			{
				tabs.splice(dst+1, 0, tabs[src]);
				tabs.splice(src, 1);
			}
			if (src < curtab && curtab <= dst)
			{
				curtab --;
			}
			else if (src > curtab && curtab >= dst)
			{
				curtab ++;
			}
			else if (src == curtab)
			{
				curtab = dst;
			}
			this.updateTabs();
			this.updateFileExplorer();
		},
		togglecollapse : function (proj)
		{
			setproj(proj);
			projects[proj].hidden = !projects[proj].hidden;
			this.updateFileExplorer();
		},
		updateFileExplorer : function ()
		{
			console.log(currproject);
			var filelist = document.getElementById('openproj');
			var str = '';
			for (var key in projects)
			{
				if (!projects.hasOwnProperty(key))
				{
					continue;
				}
				if (projects[key].hidden)
				{
					if(currproject == key)
					{
						str += '<option id="'+key+'" value="'+key+'" style="color:red" onclick="ide.togglecollapse(\''+key+'\')">+ '+key+'</option>';
					}
					else {
					str += '<option id="'+key+'" value="'+key+'" onclick="ide.togglecollapse(\''+key+'\')">+ '+key+'</option>';
					}
					continue;
				}
				if(currproject == key)
				{
					str += '<option  id="'+key+'" value="'+key+'" style="color:red" onclick="ide.togglecollapse(\''+key+'\')">- '+key+'</option>';
				}
				else {
				str += '<option  id="'+key+'" value="'+key+'" onclick="ide.togglecollapse(\''+key+'\')">- '+key+'</option>';
				}
				for (var j = 0; j < projects[key].filelist.length; j++)
				{
					var t = -1;
					for (var k = 0; k < tabs.length; k++)
					{
						if (tabs[k].projname == key && tabs[k].filename == projects[key].filelist[j])
						{
							t = k;
							break;
						}
					}
					if (t == -1)
					{
						str += '<option value="'+projects[key].filelist[j]+'" onclick="ide.opennewtab(\''+key+'\', \''+projects[key].filelist[j]+'\')">'+projects[key].filelist[j]+'</option>';
					}
					else
					{
						str += '<option value="'+projects[key].filelist[j]+'" onclick="ide.gototab('+t+')">'+projects[key].filelist[j]+'</option>';
					}
				}
			}
			filelist.innerHTML = str;
		},
		updateTabs : function ()
		{
			var tablist = document.getElementById('tabs');
			var str = ''
				for (var i = 0; i < tabs.length; i++)
				{
					if (i != curtab)
					{
						str += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+i+'" onclick="ide.gototab('+i+')">'+tabs[i].filename+'</a></li>';
					}
					else
					{
						str += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+i+'" onclick="ide.gototab('+i+')" style="background-color: gray;">'+tabs[i].filename+'</a></li>';
					}
				}
			tablist.innerHTML = str;
			document.getElementById("tab0").oncontextmenu = function(event) 
			{
				if (event.which == 3) 
				{
					alert("right clicked");
					closetab(0);
				}
			}
			document.getElementById("tab1").oncontextmenu = function(event) 
			{
				if (event.which == 3) 
				{
					alert("right clicked");
					closetab(1);
				}
			}
		}
	};

}());
