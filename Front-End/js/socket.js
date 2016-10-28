var sock;
var nickname;
var ntabs = 1;
var currfile;
var currproject;
var name;
function Connection()//works
{

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
              fileList.innerHTML += '<li><a href="#">'+name+'/</a></li>';
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

          var textareas = document.getElementById("textareas");
          textareas.innerHTML += "<div id=\"class"+ntabs+"\" class=\"tabcontent\">\n\
      <ul id='openproj'>\n\
      <li>Solution Explorer</li>\n\
      <li>"+currfile+"</li>\
      </ul>\n\
      \n\
      \n\
      <textarea rows=\"10\" cols=\"25\" id=\"codespace\" onkeydown=\"Update()\">\n\
      public class "+currfile.replace(".java", "")+"\n\
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


function Update()
{
    var message = {
        "nickname": nickname,
        "contents": "updatefile "+currfile+" "+document.getElementById('codespace').value
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
	ntabs++;
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
    var message = {
        "nickname": nickname,
        "contents": "message "+document.getElementById('commandArea').value
    }
    sock.send(JSON.stringify(message));

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
