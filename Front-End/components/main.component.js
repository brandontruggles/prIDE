import React from 'react';
import Login from './login.component';
import IDE from './ide.component';
class Main extends React.Component {
  constructor(props){
	super(props);
	this.state = {
		connected:false,
		errorMessage: null,
    		curproj:'',
    		curdir:'',
    		curfile:''
	};
	this.webSocket = null;
	this.attemptLogin = this.attemptLogin.bind(this);
	this.onWebSocketOpen = this.onWebSocketOpen.bind(this);
	this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
	this.onWebSocketError = this.onWebSocketError.bind(this);
	this.onWebSocketClose = this.onWebSocketClose.bind(this);
  	
	/*File, Proj, Dir, Creator*/
   	this.create = this.create.bind(this);
   	this.build = this.build.bind(this);
    this.message = this.message.bind(this);
  }

  attemptReconnect(){
	console.log("Attempting to reconnect to the server...");
	this.webSocket = new WebSocket("ws://0.0.0.0:9000");
	this.webSocket.onopen = this.onWebSocketOpen;
	this.webSocket.onmessage = this.onWebSocketMessage;
	this.webSocket.onerror = this.onWebSocketError;
	this.webSocket.onclose = this.onWebSocketClose;	
  }

  onWebSocketOpen(){
	var message = {
		"nickname": this.nickname,
		"contents": "connect"
	};
	this.webSocket.send(JSON.stringify(message));
  }

  onWebSocketMessage(response){
	console.log("Received message from the server: ");
	console.log(response);
	var res = JSON.parse(response.data);
	var contents = res.contents;
	switch(res.type)
	{	
		case "Connection-Accept"://Connected to Server
			if(contents.Accepted)
		    	{
			    this.setState({connected:true});			
			}
			else//Error for Connection
			{
			    this.setState({errorMessage:contents.Reason});
			}
			break;
	    /*File, Proj, Dir, Created*/
		case "Project-Created-Status":
			if(contents.Created)
			{
			    if(contents.nick == this.nickname)
			    {
			    /*needs to be connected to terminal component*/
			    }
			    else
			    {
			    /*Need to be connected to terminal and explorer*/
			    }
			}
			else
			{
			    this.setState({errorMessage:contents.Reason});
			}
			break;
		case "Directory-Created-Status":
			if(contents.Created)
			{
			    if(contents.nick == this.nickname)
			    {
			    alert("I just Created a Directory");
			    /*needs to be connected to terminal component*/
			    }
			    else
			    {
			    alert("Some just Created a Directory");
			    }
			}
			else
			{
			    this.setState({errorMessage:contents.Reason});
			}
			break;
		case "File-Created-Status":/*needs connection to solutionexplorer and terminal*/
			if(contents.Created)
			{
			    if(contents.nick == this.nickname)
			    {
			    alert("I just Created a File");
			    /*needs to be connected to terminal component*/
			}
			    else
			    {
				alert("Some just Created a File");
			    }
			}
			else
			{
			    this.setState({errorMessage:contents.Reason});
			}
			break;
		/*Chat and Console Messages*/
		case "Console":
		    /*add Message to Terminal component*/
		    break;
		case "Message-Broadcast":
		    /*add Message to Chat component*/
		    break;
		/*Git cases*/
		case "Git":
		    /*add Message to Terminal component*/
		    break;
		case "Git-auth":
		    /*Do something*/
		    break;
		/*add rest of cases*/
		/*Build and Compile*/
		case "Compile-Running-Status":
		    /*add stuff for Terminal component*/
		    break;
		case "Code-Running-Status":
		    /*add stuff for Terminal component*/
		    break;
		default:
		    break;
	  }
  }

  onWebSocketError(error){
	console.log("WebSocket error: " + error.message);
	this.setState({errorMessage: error.message});
  }

  onWebSocketClose(){
	console.log("Lost connection to the server!");
	this.setState({errorMessage: "Lost connection to the server! Attempting to reconnect..."});
	this.attemptReconnect();
  }

  attemptLogin(nickname){
	this.nickname = nickname;
	if(this.nickname == "")
	{
		var error = "You cannot enter a blank nickname!";
		this.setState({errorMessage:error});
	}
	else
	{
		console.log("Nickname: " + nickname);
		console.log("Attempting login...");
		this.webSocket = new WebSocket("ws://0.0.0.0:9000");
		this.webSocket.onopen = this.onWebSocketOpen;
		this.webSocket.onmessage = this.onWebSocketMessage;
		this.webSocket.onerror = this.onWebSocketError;
		this.webSocket.onclose = this.onWebSocketClose;
	}
  }
	
  /*File, Proj, Dir Creator*/
  create(name, type)
  {
    var message = {
      "nickname": this.nickname
    }
    switch(type)
    {
      case "proj":
        message["contents"] = "newproject " + name;
        break;
      case "dir":
        message["contents"] = "newproject " + name;
        break;
      case "file":
        message["dir"] = curdir;
        message["contents"] = "newfile " + name;
        break
    }
      this.webSocket.send(JSON.stringify(message));
   } 
    build(type)
    {
        var message = {
            "nickname": this.nickname,
            "file": this.state.curfile,
            "dir": this.state.curdir,
            "contents": type
        }
        
        this.webSocket.send(JSON.stringify(message));
    }

    message(type, value)
    {
        var message = {
            "nickname": this.nickname,
            "contents": "message "+value
        }
        this.webSocket.send(JSON.stringify(message));

  render(){
    var currComponent = <Login attemptLogin={this.attemptLogin} errorMessage={this.state.errorMessage}/>;
    if(this.state.connected)
	currComponent = <IDE create={this.create} build={this.build} errorMessage={this.state.errorMessage}/>;
    return(
	<div>
		{currComponent}
	</div>
    )

  }
}
export default Main
