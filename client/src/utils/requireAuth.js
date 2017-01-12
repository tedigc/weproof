import React from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {

  class Authenticate extends React.Component {

    componentWillMount() {
      if(!this.props.isAuthenticated) {
        this.props.router.push('/login');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props}/>
      );
    }

  }

  Authenticate.PropTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired
  };

  Authenticate.ContextTypes = {
    router: React.PropTypes.object.isRequired
  };

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  }

  return connect(mapStateToProps)(Authenticate);
}