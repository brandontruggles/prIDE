import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import {Column, Cell} from 'fixed-data-table';
import ExplorerCell from './explorercell.component';
class SolutionExplorer extends React.Component {
  constructor(props){
	super(props);
	this.state = {
		path:"/"
	};
	this.renderCounter = 0;
	this.goBack = this.goBack.bind(this);
	this.appendToPath = this.appendToPath.bind(this);
	this.generateExplorerCell = this.generateExplorerCell.bind(this);	
	this.header = <Cell>Solution Explorer<br/><FormControl readOnly type="text" value={this.state.path} placeholder="Current Path"/><br/><a href="#" onClick={this.goBack}>Back</a></Cell>;
  }

  goBack(){
	if(this.state.path != "/")
	{
		var backPath = this.state.path;
		backPath = backPath.substring(backPath.length - 1);
		var lastSlashIndex = backPath.lastIndexOf("/");
		backPath = backPath.substring(lastSlashIndex);
		this.setState({path:backPath});
	}
  }

  appendToPath(item){
	var newPath = this.state.path + item;
	console.log("New Path: " + newPath);
	this.setState({path:newPath});
  }

  generateExplorerCell(props){
	var cell = null;
	var type = "file";
	var cellItem = this.props.files[this.state.path][props.rowIndex];
	if(cellItem != null)
	{
		if(cellItem.charAt(cellItem.length - 1) == "/")
			type = "dir";
		cell = <ExplorerCell contents={cellItem} type={type} path={this.state.path} appendToPath={this.appendToPath} openFile={this.props.openFile}></ExplorerCell>;
	}
	return cell;
  }

  componentWillUpdate(nextProps, nextState){
	if(this.renderCounter == 0) //We pass a changing dummy prop to the data table Column so that it always re-render when we re-render
		this.renderCounter = 1;
	else
		this.renderCounter = 0;		
  }
  
  render(){
    return(
	<ResponsiveFixedDataTable counter={this.renderCounter} headerHeight={100} rowsCount={10} rowHeight={50}>
		<Column allowCellsRecycling={true} header={this.header} cell={this.generateExplorerCell} width={200}/>
        </ResponsiveFixedDataTable>
    );
  }
}
export default SolutionExplorer
