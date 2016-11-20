
var rtu = (function (q) 
{
	var updateflag = true;
	this.q = q;

	return 
	{
		adjustchange : function (change) 
		{
			var cur = null;
			for (var i = 0; i < q.length; i++) 
			{
				cur = q[i];
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
		enQ : function (e) 
		{
			q.push(e);
		},
		deQ : function () 
		{
			q.splice(0, 1);
		},
		rtuACK : function () 
		{
			this.deQ();
		},
		rcv : function (dir, file, e) 
		{
			var message = 
			{
				"nickname": nickname,
				"dir": dir,
				"file": file,
				"contents": "gotupdate"
			};
			sock.send(JSON.stringify(message));

			var doc = ide.findtab(dir, file);
			if (doc == null) 
			{
				return;
			}
			//e = adjustchange(e);  // adjust
			updateflag = false; // implement edit
			if (e.action == "insert")
			{
				doc.insert(e.start, e.lines.join('\n'));
			}
			else
			{
				doc.remove({"start": e.start, "end": e.end});
			}
			updateflag = true;
		},
		Update : function (e) 
		{
			if (! updateflag) 
			{
				return;
			}
			this.enQ(e);
			e['indexstart'] = editor.session.doc.positionToIndex(e.start);
			e['indexend'] = e.indexstart + e.lines.join('\n').length;
			var message = 
			{
				"nickname": nickname,
				"dir": currproject,
				"file": currfile,
				"change": e,
				"contents": "rtu"
			};
			sock.send(JSON.stringify(message));
		}
	};
}([]));
