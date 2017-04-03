import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

//browerify ace (brace) imports
import 'brace/mode/text';
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
	<AceEditor mode="text" theme="github" keyboardHandler="vim" width={"800px"}/>
    );
  }
}
export default CodeWindow
