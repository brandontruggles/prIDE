import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

//browerify ace (brace) imports
import 'brace/mode/text';
import 'brace/theme/github';
import 'brace/keybinding/vim';
/*need to import everything for later use*/

class CodeWindow extends React.Component {
    constructor(props){
	    super(props);
	    this.state = {
            mode:"text",
            theme:"github",
            keyboardHandler:"vim"
	    };
	
    }
    componentWillReceiveProps(nextProps)
    {
        /*Settings for changing themes and keyboard go here*/

        /*mode changes for here*/
        if(nextProps.aceMode != null && nextProps.aceMode != this.state.mode)
        {
            this.setState({mode: nextProps.aceMode});
        }
    }
  
  render(){
    return(
	<AceEditor mode={this.state.mode} theme={this.state.theme} keyboardHandler={this.state.keyboardHandler} width={"800px"}/>
    );
  }
}
export default CodeWindow
