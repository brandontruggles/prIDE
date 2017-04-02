import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

//browerify ace (brace) imports
import 'brace/mode/java';
import 'brace/theme/github';
import 'brace/keybinding/vim';

class CodeWindow extends React.Component {
  constructor(props){
	super(props);
	this.state = {
	};
	
  }
  
  render(){
    return(
	<AceEditor mode="java" theme="github" keyboardHandler="vim" width={"800px"}/>
    );
  }
}
export default CodeWindow
