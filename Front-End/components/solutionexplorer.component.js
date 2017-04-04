import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import {Column} from 'fixed-data-table';
import ExplorerCell from './explorercell.component';
class SolutionExplorer extends React.Component {
  constructor(props){
	super(props);
	this.state = {
	};
	this.generateExplorerCell = this.generateExplorerCell.bind(this);	
  }

  generateExplorerCell(props){
	var keys = Object.keys(this.props.files);
	var cell = <ExplorerCell contents={keys[props.rowIndex]}></ExplorerCell>;
	return cell;
  }
  
  render(){
    return(
	<ResponsiveFixedDataTable headerHeight={50} rowsCount={10} rowHeight={50}>
        	<Column allowCellsRecycling={true} header={"Solution Explorer"} cell={this.generateExplorerCell} width={200}/>
        </ResponsiveFixedDataTable>
    );
  }
}
export default SolutionExplorer
