import React from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Button, NavDropdown, MenuItem, Nav, FormControl} from 'react-bootstrap';

class Navigationbar extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      isInput:false,
      nType:''
    };
    this.EnterInput = this.EnterInput.bind(this);
    this.inputBox = '';
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(event)/*Submit for New Proj, Dir, and File*/
  {
    event.preventDefault();
    this.props.create(this.inputer.value, this.state.nType);
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
      alert(nextProps.errorMessage);
  }
  render(){
    if(this.state.isInput)
    {
      this.inputBox = <form onSubmit={this.handleSubmit}><FormControl type="text" placeholder="enter new name" ref={(input) => {this.inputer = ReactDOM.findDOMNode(input);}} autoFocus />< Button type="submit">Submit</Button></form>
    }
    else
    {
      this.inputBox = '';
    }
    return(
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">prIDE</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
          <NavDropdown title="File" id="New">
            <MenuItem onClick={this.EnterInput.bind(this,"file")}>New File</MenuItem>
            <MenuItem onClick={this.EnterInput.bind(this,"dir")}>New Directory</MenuItem>
            <MenuItem onClick={this.EnterInput.bind(this,"proj")}>New Project</MenuItem>
          </NavDropdown>
          <NavDropdown title="Edit" id="edit">
	    <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>	
	  </NavDropdown>

          <NavDropdown title="Build" id="build">
            <MenuItem onClick={this.props.build.bind(this,"compile")}>Compile</MenuItem>
            <MenuItem onClick={this.props.build.bind(this,"run")}>Run</MenuItem>
          </NavDropdown>
          
          <NavDropdown title="Git" id="git">
            <MenuItem>Init</MenuItem>
            <MenuItem>Add</MenuItem>
            <MenuItem>Commit</MenuItem>
            <MenuItem>Push</MenuItem>
          </NavDropdown>
        
        <NavDropdown title="Settings" id="settings">
		<MenuItem>Editor Theme</MenuItem>
	</NavDropdown>
          </Nav>
          {this.inputBox}
        </Navbar.Collapse>
      </Navbar>
    )
	
  }


}

export default Navigationbar
