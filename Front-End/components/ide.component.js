import React from 'react';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
//import Navigationbar from './navigationbar.component';
import SolutionExplorer from './solutionexplorer.component';
class IDE extends React.Component {
  constructor(props){
	super(props);
  }
 
  render(){
    return(
      <div>
		<div>
		
		</div>
		<Grid>
			<Row>
				<Col xs={4}>
					<SolutionExplorer/>
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
