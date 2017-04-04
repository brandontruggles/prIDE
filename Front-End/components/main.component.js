import React from 'react';
import Login from './login.component';
import IDE from './ide.component';
class Main extends React.Component {
  constructor(props){
	super(props);
	this.state = {
	connected:false,
	errorMessage: null,
        terminalMessage: null,
        chatMessage: null,
	files:{},
	curproj:'',
    	curdir:'',
    	curfile:'',
        aceMode:'text'
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
	console.log("Attempting to reconnect to the server " + this.props.url + ":" + this.props.port  + "...");
	this.webSocket = new WebSocket("ws://" + this.props.url + ":" + this.props.port);
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
			    this.setState({connected:true, files:contents.Files});			
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
                this.setState({terminalMessage:"Project: '"+contents.name+"' created."});
			    }
			    else
			    {
                    this.setState({terminalMessage:contents.nick+" Just Created Project: '"+contents.name+"'"});
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
			    /*needs to be connected to terminal component*/
                    this.setState({terminalMessage:"Directory: '"+contents.name+"' created."});
                    
			    }
			    else
			    {
                    this.setState({terminalMessage:contents.nick+" Just Created Directory: '"+contents.name+"'"});
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
			    /*needs to be connected to terminal component*/

                    this.setState({terminalMessage:"File: '"+contents.name+"' created."});
			    }
			    else
			    {
                    this.setState({terminalMessage:contents.nick+" Just Created File: '"+contents.name+"'"});
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
            this.setState({chatMessage:contents}); 
		    break;
		/*Git cases*/
		case "Git":
		    /*add Message to Terminal component*/
		    break;
		case "Git-auth":
		    /*Do something*/
		    break;
		/*Build and Compile*/
		case "Compile-Running-Status":
		    /*add stuff for Terminal component*/
		    break;
		case "Code-Running-Status":
            this.setState({terminalMessage:contents.output});
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
		console.log("Attempting login to host " + this.props.url + ":" + this.props.port + "...");
		this.webSocket = new WebSocket("ws://" + this.props.url + ":" + this.props.port);
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
    }
  render(){
    var currComponent = <Login attemptLogin={this.attemptLogin} errorMessage={this.state.errorMessage} url={this.props.url}/>;
    if(this.state.connected)
	currComponent = <IDE files={this.state.files} aceMode={this.state.aceMode} chatMessage={this.state.chatMessage} terminalMessage={this.state.terminalMessage} message={this.message} create={this.create} build={this.build} errorMessage={this.state.errorMessage}/>;
    return(
	<div>
		{currComponent}
	</div>
    )

  }
}
export default Main
