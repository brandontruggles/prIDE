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
	this.goBack = this.goBack.bind(this);
	this.appendToPath = this.appendToPath.bind(this);
	this.generateExplorerCell = this.generateExplorerCell.bind(this);	
	this.header = <Cell>Solution Explorer<br/><a href="#" onClick={this.goBack}>Back</a></Cell>;
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
	console.log("ran");
	var cell = null;
	var type = "file";
	var cellItem = this.props.files[this.state.path][props.rowIndex];
	if(cellItem != null)
	{
		if(cellItem.charAt(cellItem.length - 1) == "/")
			type = "dir";
		cell = <ExplorerCell contents={cellItem} type={type} appendToPath={this.appendToPath}></ExplorerCell>;
	}
	return cell;
  }

  componentWillUpdate(nextProps, nextState){
		
  }
  
  render(){
    return(
	<ResponsiveFixedDataTable headerHeight={50} rowsCount={10} rowHeight={50}>
		<Column allowCellsRecycling={true} header={this.header}  cell={this.generateExplorerCell} width={200}/>
        </ResponsiveFixedDataTable>
    );
  }
}
export default SolutionExplorer
