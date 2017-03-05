document.onkeydown = kd;
function kd(e) 
{
	if (e.altKey && e.keyCode == 'W'.charCodeAt(0)) 
	{
		e.preventDefault();
		ide.closetab(ide.curtab);
	}
	else if (e.altKey && e.keyCode == 'O'.charCodeAt(0)) 
	{
		e.preventDefault();
		fn.openproject();
	}
	else if (e.shiftKey && e.altKey && e.keyCode == 'N'.charCodeAt(0)) 
	{
		e.preventDefault();
		fn.newproject();
	}
	else if (e.altKey && e.keyCode == 'N'.charCodeAt(0)) 
	{
		e.preventDefault();
		fn.newfile();
	}
	else if (e.shiftKey && e.keyCode == 9) 
	{
		e.preventDefault();
		ide.tabforward();
	}
}
