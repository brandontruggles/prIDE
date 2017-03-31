import React from 'react';

class Login extends React.Component {
  
  render(){
    return(
      <div id="loader">
	<img id="logo" src="image/pridefull.png" alt="Logo"/>
	<input type="text" class="firstInput" id="firstInput" placeholder="Nickname" autofocus onkeydown="fn.chatkeydown(this)"/><br/>
	<input type="button" id="firstSubmit" value="Submit" onclick="Connection()"/>
	<br/><br/>
<input type="button" id="changebackground" value="Background"/>
	<a href="https://github.com/brandonrninefive/prIDE" id="githublink">prIDE on GitHub</a>
      </div>
    )

  }
}
export default Login
