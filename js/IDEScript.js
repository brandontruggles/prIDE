/* When the user clicks on the button,
   toggle between hiding and showing the dropdown content */
function showNewDropdown(id)
{
	closedropdowns();
	var elem = document.getElementById(id);
	if (elem.style.display == "block")
	{
		elem.style.display = "none";
	}
	else
	{
		elem.style.display = "block";
	}
	elem.style.zIndex = "5";
}

function openConsole(evt)
{
	var i, consolecontent, clicked;
	if(document.getElementById("consoleWindow").style.display == "inline-block")
	{
		document.getElementById("consoleWindow").style.display = "none";
	}
	else
	{
		document.getElementById("consoleWindow").style.display = "inline-block";
	}
}

function openChat(evt)
{
	var i, chatcontent, clicked;
	if(document.getElementById("chatWindow").style.display == "inline-block")
	{
		clicked = "true";
	}
	else
	{
		clicked = "false;"
		if(clicked == "true")
		{
			document.getElementById("chatWindow").style.display = "none";
		}
		else
		{
			document.getElementById("chatWindow").style.display = "inline-block";
		}
	}
}

function openTab(evt, fileName)
{
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++)
	{
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++)
	{
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the link that opened the tab
	document.getElementById(fileName).style.display = "block";
	evt.currentTarget.className += " active";
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event)
{
	if(!event.target.matches('.btn'))
	{
		closedropdowns();
	}
}

function closedropdowns()
{
	var dropdowns = document.getElementsByClassName("dropdowncontent");
	var i;
	for (i = 0; i < dropdowns.length; i++)
	{
		var elem = dropdowns[i];
		if (elem.style.display == "block")
		{
			elem.style.display = "none";
		}
		elem.style.zIndex = "5";
	}
}

//setting values for file
function File(button)
{
	//setting values
	document.getElementById('bar').style.display = 'block';
	document.getElementById('pushed').value = button;

	if(button == "7" || button == "10")
		document.getElementById('url').style.display = 'block';
	document.getElementById('name').focus();
}

function Creation()
{
	var num = document.getElementById('pushed').value;
	if(num == "1")
		fn.newfile();
	else if (num == "2")
		fn.newproject();
	else if (num == "3"){
		fn.getfiles(document.getElementById('name').value);
		fn.setproj(document.getElementById('name').value);
		document.getElementById('bar').removeChild(document.getElementById('list'));
	}
	else if (num == "4")
		fn.gitclone();
	else if (num == "6")
		fn.gitcommit();
	else if (num == "7") {
		fn.gitpush();
		document.getElementById('url').style.display = 'none';
	}
	else if (num == "8"){
			if(currproject)
			{
				fn.newdir();
			}
			else {
				document.getElementById('consoleWindow').innerHTML += "Not Currently in a Project!";
			}
	}
	else {
		alert("huh");
	}
	//reseting values

}

function reset()
{
	document.getElementById('bar').style.display = 'none';
	document.getElementById('name').value = "";
	document.getElementById('pushed').value = "";
}
