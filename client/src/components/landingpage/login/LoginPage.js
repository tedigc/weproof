import React from 'react';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <LoginForm/>
      </div>
    );
  }

}

export default LoginPage;