import React from 'react';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react'

class NavBar extends React.Component {

  render() {
    const activeItem = window.location.pathname;
    return (
      <Menu fixed="top" stackable inverted>
        <Menu.Item
          as={Link}
          to="/"
        >
          <img src='static/images/logo.png' alt="logo" />
        </Menu.Item>

        <Menu.Item header>
          Individual Project
        </Menu.Item>

        <Menu.Menu position="right">
        <Menu.Item
          as={Link}
          to='/signup'
          name='signup'
          active={activeItem === '/signup'}
          onClick={this.handleItemClick}
        >
          Sign up
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/login"
          name='login'
          active={activeItem === '/login'}
          onClick={this.handleItemClick}
        >
          Log in
        </Menu.Item>
      </Menu.Menu>

      </Menu>
    );
  }

}

export default NavBar;