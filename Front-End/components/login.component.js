import React from 'react';

class Login extends React.Component {
  
  render(){
    return(
      <div id="loader">
      <input type="text" id="nick" placeholder="NickName" /><br />
      <input type="button" id="firstSubmit" value="Submit" />
      </div>
    )

  }
}
export default Login
