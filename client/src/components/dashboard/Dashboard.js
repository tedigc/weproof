import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

const divStyle = {
  top: 0,
  height: "800px",
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
    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation='uncover' width='thin' visible={true} icon='labeled' vertical inverted>
          
          <Menu.Item as={Link} to='home' name='home'>
            <Icon name='home' />
            Home
          </Menu.Item>

          <Menu.Item as={Link} to='work' name='work'>
            <Icon name='industry' />
            <Link to='/work' activeClassName='active'>
              Work
            </Link>
          </Menu.Item>

          <Menu.Item as={Link} to='submitted' name='submitted'>
            <Icon name='folder open' />
            Submitted
          </Menu.Item>

          <Menu.Item as={Link} to='settings' name='setting'>
            <Icon name='setting' />
            Settings
          </Menu.Item>

          <Menu.Item name='logout' onClick={this.logout}>
            <Icon name='sign out' />
            Log Out
          </Menu.Item>

        </Sidebar>
        <Sidebar.Pusher>
          <div style={divStyle}>
            {this.props.children}  
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
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