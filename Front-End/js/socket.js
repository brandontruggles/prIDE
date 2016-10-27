var sock;
var nickname;
function Connection()
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
        if(contents.Accepted){
            alert("Connected");
            //nickname = document.getElementById('nickname').value;
            //document.location.href = "IDEMain.html";
        }
        else{
          port = prompt("Enter port");
          nickname = prompt("Enter nickname");
          sock.close();
          sock = new WebSocket("ws://45.55.218.73:"+port);
        }
    }
}



function Update()
{
    var message = {
        "nickname": nickname,
        "contents": "updatefile "+document.getElementById('filename')+" "+document.getElementById('code').value
    };
    sock.send(JSON.stringify(message));
    sock.onmessage = function(response){
        var res = JSON.parse(response.data);
        var message = res.contents;
        document.getElementById('code').value = message;
    }

}

function compile()
{
    var message = {
        "nickname": nickname,
        "contents": "compile"
    }
    sock.send(JSON.stringify(message));

    send.onmessage = function (response) {
      var res = JSON.parse(response.data);

    }
}


function newproject()
{
    var message = {
        "nickname": nickname,
        "contents": "newproject"
    }
    sock.send(JSON.stringify(message));
}

function newfile()//not now
{
    var message = {
        "nickname": nickname,
        "contents": "newfile"
    }
    sock.send(JSON.stringify(message));
}

function message()
{//for chat
    var message = {
        "nickname": nickname,
        "contents": "message "+document.getElementById('chat').value
    }
    sock.send(JSON.stringify(message));
}

function newdir()
{
    var message = {
        "nickname": nickname,
        "contents": "newdir"
    }
    sock.send(JSON.stringify(message));
    sock.onmessage = function(response){
      var res = JSON.parse(response.data);
      var contents = res.contents;
      if(contents.Created){
        alert("directory created");
      }
      else{
        alert(contents.Reason);
      }
    }
}

function openproject()//need testing possibly done
{
    var message = {
        "nickname": nickname,
        "contents": "openproject"
    }
    sock.send(JSON.stringify(message));

    sock.onmessage = function(response){
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

    }

}

function run()
{
  var message = {
    "nickname": nickname,
    "contents": "run "+
  }
  sock.send(JSON.stringify(message));

  sock.onmessage = function()
}
