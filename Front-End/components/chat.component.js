import React from 'react';
import ReactDOM from 'react-dom';
import {FormControl, FromGroup} from 'react-bootstrap';

class Chat extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            log:'hilo'
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillReceiveProps(nextProps)
    {
        if(nextProps.chat != null)
        {
            this.setState({log:this.state.log+nextProps.chat+'\n'});
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
                <FormControl componentClass="textarea" placeholder="Chat box" ref={(input) => {this.state.log = ReactDOM.findDOMNode(input);}} readOnly />
                <br />
                <FormControl type="text" placeholder="Message" ref={(input) => {this.chat = ReactDOM.findDOMNode(input);}}/>
            </form>


        )
    }

}

export default Chat
