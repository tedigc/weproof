import React from 'react';
import SignupForm from './SignupForm';
import { connect } from 'react-redux';
import { userSignupRequest } from '../../actions/signupActions';
import { addFlashMessage }   from '../../actions/flashMessages';

class SignupPage extends React.Component {

  render() {
    const { userSignupRequest, addFlashMessage } = this.props;
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <SignupForm 
          userSignupRequest={userSignupRequest} 
          addFlashMessage={addFlashMessage}
        />
      </div>
    );
  }

}

SignupPage.propTypes = {
  userSignupRequest : React.PropTypes.func.isRequired,
  addFlashMessage   : React.PropTypes.func.isRequired
}

export default connect(null, { userSignupRequest, addFlashMessage })(SignupPage);