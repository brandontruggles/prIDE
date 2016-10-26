var sock;

function Connection()
{
    sock = new WebSocket("afsaccess2.njit.edu/~btr2:8001");
    sock.onopen = function()
    {
        sock.send("Connected");
    };
}


function Update()
{
    sock.send(document.getElementById('code').value);
    sock.close();


}
 

function Receive()
{
    var sock = new WebSocket("afsaccess2.njit.edu/~btr2:8001");

    sock.onmessage = function(sent){
        var message = sent;
        document.getElementById('code').value = message;
    }
    sock.close();
    
}

