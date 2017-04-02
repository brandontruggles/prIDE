import React from 'react';
import ReactDOM from 'react-dom';
import {FormControl, FromGroup} from 'react-bootstrap';

class Chat extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            log:[]
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event)
    {
        event.preventDefault();
        this.props.message('chat',this.chat.value);
        /*this will need something later*/
        this.chat.value='';
    }
    

    render()
    {
        
        return(
            <form onSubmit={this.handleSubmit}>
                <FormControl componentClass="textarea" placeholder="Chat box" ref={(input) => {this.chatBox = ReactDOM.findDOMNode(input);}} readOnly />
                <br />
                <FormControl type="text" placeholder="Message" ref={(input) => {this.chat = ReactDOM.findDOMNode(input);}}/>
            </form>


        )
    }

}

export default Chat
