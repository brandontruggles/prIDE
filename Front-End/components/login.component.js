import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
class Login extends React.Component {
  constructor(props){
	super(props);
	this.state = {
		loggingIn:false
	};
	this.handleSubmit = this.handleSubmit.bind(this);
	this.login = this.login.bind(this);
	this.loginButton = <FormControl type="submit" value="Log In"/>;
	this.nicknameBox = <FormControl autoFocus type="text" placeholder="Nickname" ref={(input) => {this.nicknameInput = ReactDOM.findDOMNode(input);}}/>; 
  }
  handleSubmit(event){
	event.preventDefault();
	this.setState({loggingIn:true});
  }
  login(nickname){
	this.props.attemptLogin(nickname);	
  }
  componentWillReceiveProps(nextProps){
	if(nextProps.errorMessage != null)
		this.setState({loggingIn:false});
  }
  componentDidUpdate(prevProps, prevState){
	if(!prevState.loggingIn && this.state.loggingIn)
		this.login(this.nicknameInput.value);
  }
  render(){
	
	if(this.state.loggingIn)
	{
		this.loginButton = <FormControl disabled type="submit" value="Connecting..."/>;
		this.nicknameBox = <FormControl disabled type="text" placeholder="Nickname" ref={(input) => {this.nicknameInput = ReactDOM.findDOMNode(input);}}/>;
	}
	else
	{
		this.loginButton = <FormControl type="submit" value="Log In"/>;
		this.nicknameBox = <FormControl autoFocus type="text" placeholder="Nickname" ref={(input) => {this.nicknameInput = ReactDOM.findDOMNode(input);}}/>; 		
	}

    return(
      <div>
		<Grid className="loginGrid">
			<Row>
				<Col xs={4} xsOffset={4} >
					<form onSubmit={this.handleSubmit}>
						<img id="prideLogo" src="image/pridefull.png" alt="prIDE Logo"/>
						<p>An open source collaborative IDE for the modern age.</p>
						<FormGroup controlId="loginGroup">
							{this.nicknameBox}						
							{this.loginButton}
						</FormGroup>
						<p className="errorText">{this.props.errorMessage}</p>
					</form>
					<a className="loginLink" href="https://github.com/brandonrninefive/prIDE" target="_blank"><img src="image/GitHub-Mark-64px.png" alt="GitHub Logo"/><br/>prIDE on GitHub</a>
					<br/>						
					<a className="loginLink" href="https://glaad.nationbuilder.com/donate" target="_blank"><img src="image/Glaad_Purple.png" alt="Glaad Logo" width="128" height="64"/><br/>Donate to Glaad</a>
				</Col>
			</Row>
		</Grid>
      </div>
    );
  }
}
export default Login
