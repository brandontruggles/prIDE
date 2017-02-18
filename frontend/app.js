import React from 'react';
import ReactDOM from 'react-dom';


import Navbar from './components/navbar.component'

class App extends React.Component {
  render () {
    return (
      <Navbar />
    );
  
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
