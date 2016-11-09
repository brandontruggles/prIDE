
function ide() {

	this.gototab = function (num) {
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

		this.updateTabs(); //for bg color
	}

	this.tabforward = function () {
		if (curtab + 1 == tabs.length)
			this.gototab(0);
		else
			this.gototab(curtab + 1);
	}

	this.opennewtab = function (proj, file) {
		var message = {
			"nickname": nickname,
			"dir": proj,
			"contents": "readfile " + file
		}
		sock.send(JSON.stringify(message));
		return;
	}

	this.closetab = function (index) {
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
		this.updateTabs();
		this.updateFileExplorer();
	}

	this.movetab = function (src, dst) {
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
		this.updateTabs();
		this.updateFileExplorer();
	}

	this.togglecollapse = function (proj) {
		setproj(proj);
		projects[proj].hidden = !projects[proj].hidden;
		this.updateFileExplorer();
	}

	this.updateFileExplorer = function () {
		var filelist = document.getElementById('openproj');
		var str = '';
		for (var key in projects) {
			if (!projects.hasOwnProperty(key)) continue;
			if (projects[key].hidden) {
				str += '<option value="'+key+'" onclick="ide.togglecollapse(\''+key+'\')">+ '+key+'</option>';
				continue;
			}
			str += '<option value="'+key+'" onclick="ide.togglecollapse(\''+key+'\')">- '+key+'</option>';
			for (var j = 0; j < projects[key].filelist.length; j++) {
				var t = -1;
				for (var k = 0; k < tabs.length; k++)
					if (tabs[k].projname == key && tabs[k].filename == projects[key].filelist[j]) {
						t = k;
						break;
					}
				if (t == -1)
					str += '<option value="'+projects[key].filelist[j]+'" onclick="ide.opennewtab(\''+key+'\', \''+projects[key].filelist[j]+'\')">'+projects[key].filelist[j]+'</option>';
				else
					str += '<option value="'+projects[key].filelist[j]+'" onclick="ide.gototab('+t+')">'+projects[key].filelist[j]+'</option>';
			}
		}
		filelist.innerHTML = str;
	}

	this.updateTabs = function () {
		var tablist = document.getElementById('tabs');
		var str = ''
			for (var i = 0; i < tabs.length; i++) {
				if (i != curtab)
					str += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+i+'" onclick="ide.gototab('+i+')">'+tabs[i].filename+'</a></li>';
				else
					str += '<li><a href="javascript:void(0)" class="tablinks" id="tab'+i+'" onclick="ide.gototab('+i+')" style="background-color: gray;">'+tabs[i].filename+'</a></li>';
			}
		tablist.innerHTML = str;
	}

}
