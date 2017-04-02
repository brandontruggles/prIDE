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
    this.inputBox = '';
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event)/*Stores value from input box*/
  {
    this.setState({value: event.target.value});
  }
  handleSubmit()/*Submit for New Proj, Dir, and File*/
  {
    this.props.Create(this.state.value, this.state.nType);
    this.setState({inputing:false,nType:'',value:''});
  }
  EnterInput(type)/*adds input box and sumbit button*/
  {
    this.setState({inputing:true, nType:type});
  }
  componentDidUpdate(prevProps, prevState)/*here for later*/
  {
    
    //console.log("Current input state: "+this.state.inputing);
  }
  componentWillReceiveProps(nextProps)/*Error checking*/
  {
    if(nextProps.errorMessage != null)
      alert(nextProps.errorMessage);
  }
  render(){
    if(this.state.inputing)
    {
      this.inputBox = <div><input type="text" placeholder="enter new name"  value={this.state.value} onChange={this.handleChange} /><input type="button" onClick={this.handleSubmit.bind(this,this.inputBox.value)} value="Submit" /></div>
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
