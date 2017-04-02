import React from 'react';
import ReactDOM from 'react-dom';


class Chat extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            log:[],
            value:''
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event)
    {
        this.setState({value: event.target.value});
    }

    handleSubmit()
    {
        this.props.message('chat',this.state.value);
        /*this will need something later*/
        this.setState({value:''});
    }
    

    render()
    {
        
        return(
            <div>
                <textarea placeholder="Chat Window" id="chatWindow" readOnly></textarea>
                <br />
                <input placeholder="Message" id="chat"  value={this.state.value} onChange={this.handleChange}  />
            </div>


        )
    }

}

export default Chat
