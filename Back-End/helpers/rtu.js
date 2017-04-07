var fs = require('fs'); //Used to read/write from/to files on the server.

var logs = {};

var exports = 
{
	incqstate : function (fpath, nick) 
	{
		console.log("LOGS: ");
		console.log(fpath);
		logs[fpath].nick++;
	},
	adjustchange : function (fpath, nick, change) 
	{
		var cur = null;
		for (var i = logs[fpath].nick; i < logs[fpath].changes.length; i++)
		{
			cur = logs[fpath].changes[i];
			if (cur.start.row < change.start.row)
			{
				if (change.action == "insert")
				{
					change.start.row += cur.lines.length - 1;
				}
				else
				{
					change.start.row -= cur.lines.length - 1;
				}
			}
			else if (cur.start.row == change.start.row)
			{
				if (cur.start.column <= change.start.column)
				{
					if (change.action == "insert")
					{
						change.start.column += cur.end.column - cur.start.column;
					}
					else
					{
						change.start.column -= cur.end.column - cur.start.column;
					}
				}
			}
		}
		return change;
	},
	bufwrite : function (file, change) 
	{
		if (change.action == "insert") 
		{
			//logs[file].str = logs[file].str.split('').splice(change.indexstart, 0, change.lines.join('\n').split('')).join('');
			logs[file].str = logs[file].str.slice(0, change.indexstart) + change.lines.join('\n') + logs[file].str.slice(change.indexstart);
		}
		else 
		{
			//logs[file].str = logs[file].str.split('').splice(change.indexstart, change.indexend - change.indexstart).join('');
			logs[file].str = logs[file].str.slice(0, change.indexstart) + logs[file].str.slice(change.indexend);
		}

		console.log(logs[file].str);
		fs.writeFileSync(global.appRoot + "/Workspace" + file, logs[file].str); // save to file
	},
	enQ : function (fpath, change) 
	{
		if (logs[fpath] == null)
		{
			logs[fpath]["changes"] = [change];
		}
		else
		{
			logs[fpath].changes.push(change);
		}
	},
	readfile : function (nickname, fpath, str) 
	{
		if (logs[fpath] == null) 
		{
			logs[fpath] = {"changes": [{"start": {"row": 0, "column": 0}, "action": "insert", "lines": str.split('\n')}]};
			logs[fpath]["str"] = str;
		}
		logs[fpath][nickname] = logs[fpath].changes.length;
	},
	newfile : function (fpath, startContents) 
	{
		logs[fpath] = {"changes": [], "str": startContents, nickname: 0};
	}
};

module.exports = exports;
