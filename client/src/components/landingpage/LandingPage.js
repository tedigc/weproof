import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';
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
      <Container>
        <NavBar/>
        <div style={{ marginTop: "80px" }}>
          {this.props.children}
        </div>
      </Container>
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