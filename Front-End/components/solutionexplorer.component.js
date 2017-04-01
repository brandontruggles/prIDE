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
	<ResponsiveFixedDataTable headerHeight={50} rowsCount={10} rowHeight={50}>
        	<Column header={"Solution Explorer"} cell={<Cell>Basic content</Cell>} width={200}/>
        </ResponsiveFixedDataTable>
    );
  }
}
export default SolutionExplorer
