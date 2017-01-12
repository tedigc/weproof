import React from 'react';
import { connect } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

class App extends React.Component {

  render() {
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