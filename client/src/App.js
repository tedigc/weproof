import React from 'react';
import { connect } from 'react-redux';
import { Router, browserHistory } from 'react-router';
// import DashboardContainer from './containers/dashboard/DashboardContainer';
// import LandingPageContainer from './containers/landingpage/LandingPageContainer';
import routes from './routes';

class App extends React.Component {

  render() {

    // let container = null;
    // if(this.props.auth.isAuthenticated) {
    //   // if authenticated, show the dashboard
    //   container = <DashboardContainer/>;
    // } else {
    //   // else, show the landing page
    //   container = <LandingPageContainer/>
    // }

    return <Router history={browserHistory} routes={routes}/>;
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