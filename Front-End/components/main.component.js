import React from 'react';
import Login from './login.component';
import IDE from './ide.component';
class Main extends React.Component {
  constructor(props){
	super(props);
	this.state = {
		connected:false,
		errorMessage: null
	};
	this.webSocket = null;
	this.attemptLogin = this.attemptLogin.bind(this);
	this.onWebSocketOpen = this.onWebSocketOpen.bind(this);
	this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
	this.onWebSocketError = this.onWebSocketError.bind(this);
	this.onWebSocketClose = this.onWebSocketClose.bind(this);
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
	}
  }

  onWebSocketError(error){
	console.log("WebSocket error: " + error);
  }

  onWebSocketClose(){
	console.log("Lost connection to the server!");
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
  
  render(){
    var currComponent = <Login attemptLogin={this.attemptLogin} errorMessage={this.state.errorMessage}/>;
    if(this.state.connected)
	currComponent = <IDE/>;
    return(
	<div>
		{currComponent}
	</div>
    )

  }
}
export default Main
