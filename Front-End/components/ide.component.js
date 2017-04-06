import React from 'react';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
import Navigationbar from './navigationbar.component';
import SolutionExplorer from './solutionexplorer.component';
import CodeWindow from './codewindow.component';
import Terminal from './terminal.component';
import Chat from './chat.component';
import $ from 'jquery';
class IDE extends React.Component {
  constructor(props){
	super(props);
  }
 
  render(){
    return(
      <div id="MainIDE">
		<Navigationbar process={this.props.process} create={this.props.create} build={this.props.build} errorMessage={this.props.ErrorMessage} changeBackground={this.props.changeBackground}/>
		<Grid fluid={true}>
			<Row>
				<Col id="solutionexplorer" xs={2} md={2}>
					<SolutionExplorer sendPath={this.props.sendPath} readFile={this.props.readFile} files={this.props.files}/>
				</Col>
				<Col id="codewindow" xs={8} md={8}>
					<CodeWindow readOnly={this.props.readOnly} editorOnLoad={this.props.editorOnLoad} rtuUpdate={this.props.rtuUpdate} body={this.props.body} file={this.props.file} aceMode={this.props.aceMode} />
				</Col>
				<Col xs={2} md={2}>
                    			<Chat chatMessage={this.props.chatMessage} message={this.props.message}/>
				</Col>
			</Row>
			<Row>
				<Col xs={8} xsOffset={2}>
					<Terminal message={this.props.message} terminalMessage={this.props.terminalMessage} />
				</Col>
			</Row>
		</Grid>
        
      </div>
    );
  }
}
export default IDE

