import React from 'react';
import ReactDOM from 'react-dom';
import {FormControl, FromGroup} from 'react-bootstrap';

class Chat extends React.Component{
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
        if(nextProps.chatMessage != null)
        {
            this.setState({log:this.state.log+nextProps.chatMessage+'\n'});
        }
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
                <FormControl componentClass="textarea" placeholder="Chat box" value={this.state.log} ref={(input) => {this.chatBox = ReactDOM.findDOMNode(input);}} readOnly />
                <br />
                <FormControl type="text" placeholder="Message" ref={(input) => {this.chat = ReactDOM.findDOMNode(input);}}/>
            </form>


        )
    }

}

export default Chat
