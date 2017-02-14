import React from 'react';
import { connect } from 'react-redux';
import NavBar from './NavBar';

class LandingPage extends React.Component {

  // Re-route back to dashboard if user is logged in
  componentWillMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.router.push('/dashboard/home');
    }
  }

  render() {
    return (
      <div>
        <NavBar/>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }

}

LandingPage.propTypes ={
  auth : React.PropTypes.object.isRequired
};

LandingPage.contextTypes ={
  router : React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(LandingPage);