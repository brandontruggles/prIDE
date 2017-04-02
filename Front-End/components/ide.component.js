import React from 'react';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
import Navigationbar from './navigationbar.component';
import SolutionExplorer from './solutionexplorer.component';
import CodeWindow from './codewindow.component';
import Terminal from './terminal.component';
import Chat from './chat.component';
class IDE extends React.Component {
  constructor(props){
	super(props);
  }
 
  render(){
    return(
      <div>
		<Navigationbar create={this.props.create} build={this.props.build} errorMessage={this.props.ErrorMessage}/>
		<Grid>
			<Row>
				<Col xs={2} style={{height:"400px"}}>
					<SolutionExplorer/>
				</Col>
				<Col xs={8}>
					<CodeWindow/>
				</Col>
				<Col xs={2}>
                    			<Chat/>
				</Col>
			</Row>
		</Grid>
        <Terminal/>
      </div>
    );
  }
}
export default IDE
