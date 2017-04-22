import React from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Button, NavDropdown, MenuItem, Nav, FormControl, NavItem} from 'react-bootstrap';

class Navigationbar extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      isInput:false,
      nType:'',
      isAuth:true
    };
    this.EnterInput = this.EnterInput.bind(this);
    this.inputBox = '';
    this.gitBox = '';
    this.handleSubmit = this.handleSubmit.bind(this);
    /*git integration*/
 /*   this.gitAuth = this.gitAuth.bind(this);
    this.processAuth = this.processAuth.bind(this);
    this.parseGithubCode = this.parseGithubCode.bind(this);
    */
  }
  
  handleSubmit(event)/*Submit for New Proj, Dir, and File/ Adding Git code here as well*/
  {
    event.preventDefault();
    if(this.state.nType.indexOf('git') != -1) /*a git function*/
    {
        this.props.create(this.inputer.value, this.urlInput.value, this.state.nType)
        this.urlInput.value='';
    }
    else
    {
        this.props.create(this.inputer.value, null,this.state.nType);
    }
    this.setState({isInput:false,nType:''});
    this.inputer.value='';
  }
  EnterInput(type)/*adds input box and sumbit button*/
  {
    this.setState({isInput:true, nType:type});
  }
  componentDidUpdate(prevProps, prevState)/*here for later*/
  {
    
  }
  componentWillReceiveProps(nextProps)/*Error checking*/
  {
    if(nextProps.errorMessage != null)
  {
      if(nexProps.errorMessage == "Authentication complete")
          this.setState({isAuth:true});
  }
  }
  
  /*  gitAuth()
    {
	    var win = window.open("https://github.com/login/oauth/authorize?client_id=a0529985d128d88ea4b7&scope=repo,user", "GitHub Authentication", "width=400,height=500");
		win.focus();
    }
    parseGithubCode()
    {
	    var search = window.location.search;
	    window.opener.fn.processAuth(search);
	    window.close();
    }
    processAuth(params)
	{
			params = params.replace("?code=","");
			var message =
			{
				"nickname": nickname,
				"contents": "git_auth " + params
			};
	}
*/

  cut(){

  }

  copy(){
 
  }

  paste(){

  }
        
  render(){
    if(this.state.isInput)
    {
        if(this.state.nType.indexOf('git_remote') != -1)
        {
            this.inputBox = <form className="formSheet" onSubmit={this.handleSubmit}><FormControl id="newInput" type="text" placeholder="enter new name" ref={(input) => {this.inputer = ReactDOM.findDOMNode(input);}} autoFocus /><FormControl id="newInput" type="text" placeholder="enter url" ref={(input) => {this.urlInput = ReactDOM.findDOMNode(input);}} /></form>
        }
        else
        {
            this.inputBox = <form className="formSheet" onSubmit={this.handleSubmit}><FormControl id="newInput" type="text" placeholder="enter new name" ref={(input) => {this.inputer = ReactDOM.findDOMNode(input);}} autoFocus />< Button type="submit">Submit</Button></form>
        }
    }
    else
    {
      this.inputBox = '';
    }

    if(!this.state.isAuth)
    {
        this.gitBox = <NavItem id="git" >Git</NavItem>;
    }
    else
    {
        
       this.gitBox = <NavDropdown title="Git" id="git" >
            <MenuItem id="git" onClick={this.props.create.bind(this,null,null,"git_init")}>Init</MenuItem>
            <MenuItem id="git" onClick={this.props.create.bind(this,null,null,"git_add")}>Add</MenuItem>
            <MenuItem id="git" onClick={this.EnterInput.bind(this,"git_commit")}>Commit</MenuItem>
            <MenuItem id="git" onClick={this.EnterInput.bind(this,"git_clone")}>Clone</MenuItem>
        </NavDropdown>;
    }
    return(
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
	      <img src="image/pridefull.png" alt="prIDE Logo"/>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav id="navButtons">
          <NavDropdown title="File" id="file">
            <MenuItem id="file" onClick={this.EnterInput.bind(this,"file")}>New File</MenuItem>
            <MenuItem id="file" onClick={this.EnterInput.bind(this,"dir")}>New Directory</MenuItem>
            <MenuItem id="file" onClick={this.EnterInput.bind(this,"proj")}>New Project</MenuItem>
          </NavDropdown>
          <NavDropdown title="Edit" id="edit">
	    <MenuItem id="edit" onClick={this.cut.bind(this)}>Cut</MenuItem>
            <MenuItem id="edit" onClick={this.copy.bind(this)}>Copy</MenuItem>
            <MenuItem id="edit" onClick={this.paste.bind(this)}>Paste</MenuItem>	
	  </NavDropdown>

          <NavDropdown title="Build" id="build">
            <MenuItem id="build" onClick={this.props.build.bind(this,"compile")}>Compile</MenuItem>
            <MenuItem id="build" onClick={this.props.build.bind(this,"run")}>Run</MenuItem>
          </NavDropdown>
          
          {this.gitBox}
        
        <NavDropdown title="Settings" id="settings">
		<MenuItem id="settings" onClick={this.props.changeBackground}>Editor Theme</MenuItem>
	</NavDropdown>
	<Navbar.Text pullRight>
		Current File: {this.props.curfile}
	</Navbar.Text>
          </Nav>
	<Nav pullRight>
		<NavItem eventKey={1} href="https://github.com/brandonrninefive/prIDE" src="image/githubmini.png">
			<img id="githubmini" src="image/githubmini.png" alt="GitHub Logo"/>
		</NavItem>
		<NavItem eventKey={1} href="https://glaad.nationbuilder.com" src="image/githubmini.png">
			<img id="glaadmini" src="image/Glaad_Purple.png" alt="Glaad Logo"/>
		</NavItem>
	</Nav>
          {this.inputBox}
        </Navbar.Collapse>
      </Navbar>
    )
	
  }


}

export default Navigationbar
