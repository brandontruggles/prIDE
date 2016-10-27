var sock;

function Connection()
{
    sock = new WebSocket("ws://45.55.218.73:"+document.getElementById('port').value);
    sock.onopen = function()
    {
        var connect = {
            "nickname": document.getElementById('nickname').value,
            "contents": "connect"
        };
        sock.send(JSON.stringify(connect));
    };
    sock.onmessage = function(response){
        var res = JSON.parse(response.data);
        var contents = res.contents;
        if(contents.Accepted){
            alert("Connected");
            document.location.href = "index.html";
        }
        else{
            alert("Could not connect because"+ contents.Reason);
        }
    }
}


function Update()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "updatefile "+document.getElementById('filename')+" "+document.getElementById('code').value
    };
    sock.send(JSON.stringify(message));


}


function Receive()
{
    sock.onmessage = function(response){
        var res = JSON.parse(response.data);
        var message = res.contents;
        if(message)
        document.getElementById('code').value = message;
    }

}

function compile()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "compile"
    }
    sock.send(JSON.stringify(message));
}


function newproject()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "newproject"
    }
    sock.send(JSON.stringify(message));
}

function newfile()//not now
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "newfile"
    }
    sock.send(JSON.stringify(message));
}

function message()
{//for chat
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "message "+document.getElementById('chat').value
    }
    sock.send(JSON.stringify(message));
}

function newdir()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "newdir"
    }
    sock.send(JSON.stringify(message));
}

function openproject()//need testing possibly done
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "openproject"
    }
    sock.send(JSON.stringify(message));

    sock.onmessage = function(response){
        var res = JSON.parse(response.data);
        var contents = res.contents;
        if(contents.Opened){
          var fileList = document.getElementById('openproj');
          fileList.innerHTML = '<ul>';//empty out file explorer
          for(var i = 0; i < contents.Files.length; i++){
            fileList.innerHTML += '<li><a href="#">'+contents.Files[i]+'</a></li>';
          }
          fileList.innerHTML += '</ul>;'

        }
        else{
          alert("no projects make one");
        }

    }

}
