import React from 'react';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
import Navbar from './navbar.component';
class IDE extends React.Component {
  constructor(props){
	super(props);
  }
 
  render(){
    return(
      <div>
		<Navbar/>
		<Grid>
			<Row>
				<Col xs={4}>

				</Col>
				<Col xs={4}>

				</Col>
				<Col xs={4}>

				</Col>
			</Row>
		</Grid>
      </div>
    );
  }
}
export default IDE
