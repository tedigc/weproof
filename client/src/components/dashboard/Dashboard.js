import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { logout } from '../../actions/authActions';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        {this.props.children}
        <Button content="Log out" onClick={this.logout}/>
      </div>
    );
  }

}

Dashboard.propTypes = {
  logout: React.PropTypes.func.isRequired
};

export default connect(null, { logout })(Dashboard);