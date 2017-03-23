import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Main from './components/main.component';

class App extends React.Component {
  render() {
    const main = () => (<Main/>);
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
