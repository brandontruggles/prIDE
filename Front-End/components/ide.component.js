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
					<SolutionExplorer files={this.props.files}/>
				</Col>
				<Col xs={8}>
					<CodeWindow aceMode={this.props.aceMode} />
				</Col>
				<Col xs={2}>
                    			<Chat chatMessage={this.props.chatMessage} message={this.props.message}/>
				</Col>
			</Row>
		</Grid>
        <Terminal message={this.props.message} terminalMessage={this.props.terminalMessage} />
      </div>
    );
  }
}
export default IDE
