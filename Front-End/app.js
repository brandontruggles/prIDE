import React from 'react';
import ReactDOM from 'react-dom';


import Navbar from './components/navbar.component'

import Login from './components/login.component'
class App extends React.Component {
  render () {
    return (
      <Login />
    );
  
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
