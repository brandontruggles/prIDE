import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Main from './components/main.component';
class App extends React.Component {
  constructor(props){
	super(props);
	this.port = 9000;
  }

  render() {
    console.log(this.port);
    const main = () => (<Main url={location.hostname} port={this.port}/>);
    return (
	<Router>
		<div>
			<Route exact path="/" component={main}/>
		</div>
	</Router>
    );  
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
