import React from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Button, NavDropdown, MenuItem, Nav } from 'react-bootstrap';

class Navigationbar extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      inputing:false,
      nType:'',
      value:''
    };
    this.EnterInput = this.EnterInput.bind(this);
    this.inputBox;
  }
  EnterInput(type)
  {
    this.setState({inputing:true, nType:type});
  }
  componentDidUpdate(prevProps, prevState)
  {
    if(prevState.inputing && !this.state.inputing)
      alert(this.state.value);
      /*websocket code*/
    
  }
  render(){
    if(this.state.inputing)
    {
      this.inputBox = <div><input type="text" placeholder="enter new name" value={this.state.value} onChange={(e) => this.setState({value: e})} /><input type="submit" value="Submit" /></div>
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

          <NavDropdown title="Build" id="build">
            <MenuItem>Build</MenuItem>
            <MenuItem>Compile</MenuItem>
          </NavDropdown>
          
          <NavDropdown title="Git" id="git">
            <MenuItem>Init</MenuItem>
          </NavDropdown>
          </Nav>
          {this.inputBox}
        </Navbar.Collapse>
      </Navbar>
    )
	
  }


}

export default Navigationbar
