import React from 'react';
import ReactDOM from 'react-dom';
import {FormControl} from 'react-bootstrap';

class Terminal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            log:''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillReceiveProps(nextProps)
    {
        if(nextProps.terminalMessage != null)
        {
            this.setState({log:this.state.log+nextProps.terminalMessage+'\n'});
        }
    }
    handleSubmit(event)
    {
        event.preventDefault();
        this.props.message('terminal',this.command.value);
        /*this will need something later*/
        this.command.value='';
    }

    render()
    {
        
        return (
            <form onSubmit={this.handleSubmit}>
                <FormControl componentClass="textarea" placeholder="Terminal box" value={this.state.log}readOnly />
                <br />
                <FormControl type="text" placeholder="command" ref={(input) => {this.command = ReactDOM.findDOMNode(input);}}/>
            </form>
        )

    }
}

export default Terminal
