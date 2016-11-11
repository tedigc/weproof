import React from 'react';
import SignupForm from './SignupForm';
import { connect } from 'react-redux';
import { userSignupRequest } from '../../actions/signupActions';

class SignupPage extends React.Component {

  render() {
    const { userSignupRequest } = this.props;
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <SignupForm userSignupRequest={userSignupRequest} />
      </div>
    );
  }

}

SignupPage.propTypes = {
  userSignupRequest : React.PropTypes.func.isRequired
}

// function mapStateToProps(state) {
//   return {};
// }

// function mapDispatchToProps(dispatch) {
//   return { userSignupRequest };
// }

export default connect(null, { userSignupRequest })(SignupPage);