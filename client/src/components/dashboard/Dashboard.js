import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

const SIDEBAR_WIDTH = 128;
const MAIN_MARGIN   = 32;

const style = {
  menu : {
    position      : 'fixed',
    top           : 0,
    bottom        : 0,
    left          : 0,
    width         : SIDEBAR_WIDTH,
    paddingBottom : '1em',
    background    : '#09222B',
    overflowY     : 'scroll',
  },
  main : {
    marginLeft  : SIDEBAR_WIDTH + MAIN_MARGIN,
    marginTop   : MAIN_MARGIN,
    marginRight : MAIN_MARGIN,
    minWidth    : parseInt(SIDEBAR_WIDTH, 10) + 300,
  }
};


class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
    this.context.router.push('/');
  }

  render() {
    const activeItem = window.location.pathname;
    return (
      <div style={style.container}>
        <Sidebar style={style.menu} as={Menu} animation='uncover' width='thin' visible={true} icon='labeled' vertical inverted>

          <Menu.Item as={Link} to='/dashboard/home' name='home' active={activeItem === '/dashboard/home'}>
            <Icon name='home' />
            Home
          </Menu.Item>

          <Menu.Item as={Link} to='/dashboard/work' name='work' active={activeItem === '/dashboard/work'}>
            <Icon name='industry' />
              Work
          </Menu.Item>

          <Menu.Item as={Link} to='/dashboard/submitted' name='submitted' active={activeItem === '/dashboard/submitted'}>
            <Icon name='tasks' />
            Submitted
          </Menu.Item>

          <Menu.Item as={Link} to='/dashboard/excerpts' name='excerpts' active={activeItem === '/dashboard/excerpts'}>
            <Icon name='folder open' />
            My Excerpts
          </Menu.Item>

          {/*<Menu.Item as={Link} to='/dashboard/settings' name='setting' active={activeItem === '/dashboard/settings'}>
            <Icon name='setting' />
            Settings
          </Menu.Item>*/}

          <Menu.Item name='logout' onClick={this.logout}>
            <Icon name='sign out' />
            Log Out
          </Menu.Item>

        </Sidebar>          
        <div style={style.main}>
          {this.props.children}  
        </div>
      </div>
    );
  }

}

Dashboard.propTypes = {
  logout: React.PropTypes.func.isRequired
};

Dashboard.contextTypes = {
  router : React.PropTypes.object.isRequired 
}

export default connect(null, { logout })(Dashboard);