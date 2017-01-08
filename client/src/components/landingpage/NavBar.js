import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import { Menu } from 'semantic-ui-react'

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const activeItem = 'sign-in';

    const guestOptions = (
      <Menu.Menu position="right">
        <Menu.Item
          name='signup'
          active={activeItem === 'signup'}
          onClick={this.handleItemClick}
        >
          <Link to='/signup' activeClassName='active'>
            Sign up
          </Link>
        </Menu.Item>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={this.handleItemClick}
        >
          <Link to='/login' activeClassName='active'>
            Log in
          </Link>
        </Menu.Item>
      </Menu.Menu>
    );

    const userOptions = (
      <Menu.Item
        name='logout'
        position="right"
        active={activeItem === 'signup'}
        onClick={this.logout}
      >
        Log out
      </Menu.Item>
    );
    return (
      <Menu stackable>
        <Menu.Item>
          <img src='http://semantic-ui.com/images/logo.png' />
        </Menu.Item>

        {isAuthenticated ? userOptions : guestOptions }

      </Menu>
    );
  }

}

NavBar.propTypes = {
  auth  : React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { logout })(NavBar);