import React from 'react';
import ReactDOM from 'react-dom';
import {FormControl} from 'react-bootstrap';

class Terminal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            log:[],
            value:''
        }
        this.handleChange = this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event)
    {
        this.setState({value: event.target.value});
    }
    handleSubmit(event)
    {
       /* event.preventDefault();*/
        this.props.message('terminal',this.state.value);
        /*this will need something later*/
        this.setState({value:''});
    }

    render()
    {
        
        return (
            <div>
                <textarea placeholder="Terminal" id="terminalWindow" readOnly></textarea>
                <br />
                <input placeholder="Command" id="terminal" value={this.state.value} onChange={this.handleChange}  />
            </div>
        )

    }
}

export default Terminal
