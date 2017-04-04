import React from 'react';
import ReactDOM from 'react-dom';
import {Cell} from 'fixed-data-table';
class ExplorerCell extends React.Component {
  constructor(props){
	super(props);
	this.state = {
	};
  }
  
  render(){
    return(
	<Cell>
		<a href="#">
			{this.props.contents}
		</a>
	</Cell>
    );
  }
}
export default ExplorerCell
