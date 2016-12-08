
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
				"dir": projects[proj].path,
				"contents": "readfile " + file
			};
			sock.send(JSON.stringify(message));
			return;
		},
		closetab : function (index)
		{
			if(isNaN(index))
				index = curtab;

			if (tabs.length == 1)
			{
				tabs = [];
				currfile = '';
				editor.setSession(ace.createEditSession('', "ace/mode/java"));
				this.updateTabs();
				this.updateFileExplorer();
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


		updatefolder : function(str,key,l)
		{
				var end = key.split('/')[key.split('/').length-1];
				l+= '&emsp;';
				if (projects[key].hidden)
				{
					if(currproject == key)
					{
						str += '<option id="'+key+'" value="'+end+'" style="color:red" onclick="ide.togglecollapse(\''+key+'\')">'+l+'+'+end+'</option>';
					}
					else if (currfolder == key)
					{
						str += '<option id="'+key+'" value="'+end+'" style="color:yellow" onclick="ide.togglecollapse(\''+key+'\')">'+l+'+'+end+'</option>';
					}
					else {
					str += '<option id="'+key+'" value="'+end+'" onclick="ide.togglecollapse(\''+key+'\')">'+l+'+'+end+'</option>';
					}
				}
			else{
				if(currproject == key)
				{
					str += '<option  id="'+key+'" value="'+end+'" style="color:red" onclick="ide.togglecollapse(\''+key+'\')">'+l+'-'+end+'</option>';
				}
				else if (currfolder == key)
				{
					str += '<option  id="'+key+'" value="'+end+'" style="color:yellow" onclick="ide.togglecollapse(\''+key+'\')">'+l+'-'+end+'</option>';
				}
				else {
				str += '<option  id="'+key+'" value="'+end+'" onclick="ide.togglecollapse(\''+key+'\')">'+l+'-'+end+'</option>';
				}
				str = this.updatefiles(str,key,l);
			}

			return str;
		},

		updatefiles : function(str,key,l)
		{
			//
			for (var j = 0; j < projects[key].filelist.length; j++)
			{
				if(projects[key].filelist[j].includes('/'))
				{
					str = ide.updatefolder(str, projects[key].path+'/'+projects[key].filelist[j].slice(0,-1),l);
					if(projects[projects[key].path+'/'+projects[key].filelist[j].slice(0,-1)].hidden){
						continue;
					}

				}
				else{
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
					str += '<option value="'+projects[key].filelist[j]+'" onclick="ide.opennewtab(\''+key+'\', \''+projects[key].filelist[j]+'\')">'+l+projects[key].filelist[j]+'</option>';
				}
				else
				{
					str += '<option value="'+projects[key].filelist[j]+'" onclick="ide.gototab('+t+')">'+l+projects[key].filelist[j]+'</option>';
				}
				}
			}

			return str;
		},
		updateFileExplorer : function ()//work in progress
		{//needs to be separated into different functions
			var filelist = document.getElementById('openproj');
			var str = '';
			var l = '';
			for (var key in projects)
			{
				if (!projects.hasOwnProperty(key))
				{
					continue;
				}
				if(key.includes('/'))
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
				str = this.updatefiles(str,key,l);

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
						str += '<li><a href="javascript:void(0)" class="tablinks" oncontextmenu="ide.closetab('+i+'); return false;" id="tab'+i+'" onclick="ide.gototab('+i+')">'+tabs[i].filename+'</a></li>';
					}
					else
					{
						str += '<li><a href="javascript:void(0)" class="tablinks" oncontextmenu="ide.closetab('+i+'); return false;" id="tab'+i+'" onclick="ide.gototab('+i+')" style="background-color: gray;">'+tabs[i].filename+'</a></li>';
					}
				}
			tablist.innerHTML = str;

		}
	};

}());
