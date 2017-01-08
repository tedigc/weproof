import React from 'react';
import { connect } from 'react-redux';
import DashboardContainer from './containers/dashboard/DashboardContainer';
import LandingPageContainer from './containers/landingpage/LandingPageContainer';

class App extends React.Component {

  render() {

    let container = null;
    if(this.props.auth.isAuthenticated) {
      // if authenticated, show the dashboard
      container = <DashboardContainer/>;
    } else {
      // else, show the landing page
      container = <LandingPageContainer/>
    }

    return container;
  }

}

App.PropTypes = {
  auth : React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(App);