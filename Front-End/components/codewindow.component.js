import React from 'react';
import brace from 'brace';
import AceEditor from './ace.component';

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
            keyboardHandler:"vim",
            file: '',
            body:'',
            readOnly: false
	    };
	
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps)
    {
        /*Settings for changing themes and keyboard go here*/

        /*mode changes for here*/
        if(nextProps.aceMode != null && nextProps.aceMode != this.state.mode)
        {
            this.setState({mode: nextProps.aceMode});
        }

        if(nextProps.body != this.state.body)
        {
            this.setState({body: nextProps.body});
        }
    }
  
    handleChange(change)
    {
       this.props.rtuUpdate(change); 
    }

  render(){
    return(
	<AceEditor value={this.state.body} onLoad={this.props.editorOnLoad} onChange={this.handleChange} readOnly={this.state.readOnly} mode={this.state.mode} theme={this.state.theme} keyboardHandler={this.state.keyboardHandler} height={"100%"} width={"100%"} editorProps={{$blockScrolling: true}} />
    );
  }
}
export default CodeWindow
