import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Button, FormGroup, FormControl} from 'react-bootstrap';
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import {Column, Cell} from 'fixed-data-table';
class SolutionExplorer extends React.Component {
  constructor(props){
	super(props);
	this.state = {
	};
	
  }
  render(){
	
    return(
      <div>
	<ResponsiveFixedDataTable width={200} rowsCount={1} rowHeight={200} headerHeight={50}>
		<Column align={"center"} header={"Solution Explorer"} width={200} minWidth={200} maxWidth={500} cell={<Cell>This is a test cell.</Cell>}/>
	</ResponsiveFixedDataTable>		
      </div>		
    );
  }
}
export default SolutionExplorer
