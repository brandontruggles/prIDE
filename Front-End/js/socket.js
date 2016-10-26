var sock;

function Connection()
{
    sock = new WebSocket("ws://0.0.0.0:"+document.getElementById('port').value);
    sock.onopen = function()
    {
        var connect = {
            "nickname": document.getElementById('nickname').value,
            "contents": "connect"
        };
        sock.send(connect);
    };
    sock.onmessage = function(response){
        var res = JSON.parse(response);
        if(res.Accepted){
            alert("Connected");
        }
        else{
            alert("Could not connect because"+res.Reason);
        }
    }
}


function Update()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "updatefile "+document.getElementById('filename')+" "+document.getElementById('code').value
    };
    sock.send(message);


}


function Receive()
{
    sock.onmessage = function(sent){
        var message = JSON.parse(sent);
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
    sock.send(message);
}


function newproject()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "newproject"
    }
    sock.send(message);
}

function newfile()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "newfile"
    }
    sock.send(message);
}

function message()
{//for chat
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "message "+document.getElementById('chat').value
    }
    sock.send(message);
}

function newdir()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "newdir"
    }
    sock.send(message);
}

function openproject()
{
    var message = {
        "nickname": document.getElementById('name').value,
        "contents": "openproject"
    }
    sock.send(message);
}
