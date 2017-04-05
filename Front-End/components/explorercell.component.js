import React from 'react';
import ReactDOM from 'react-dom';
import {Cell} from 'fixed-data-table';
class ExplorerCell extends React.Component {
  constructor(props){
	super(props);
	this.state = {
	};
	this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
	if(this.props.contents.charAt(this.props.contents.length - 1) == "/")
		this.props.appendToPath(this.props.contents);
  }
  
  render(){
	var iconClass = "";
	if(this.props.type == "dir")
	{
		iconClass = "glyphicon glyphicon-folder-close"
	}
	else if(this.props.type == "file")
	{
		iconClass = "glyphicon glyphicon-file";
	}
	iconClass += " explorerCellIcon"
    return(
	<Cell>
		<a href="#" onClick={this.handleClick}>
			<span className={iconClass}></span>
			{this.props.contents}
		</a>
	</Cell>
    );
  }
}
export default ExplorerCell
