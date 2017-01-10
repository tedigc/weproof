import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

const divStyle = {
  top: 0,
  height: "100vh",
  marginLeft: "32px",
  marginRight: "250px",
  marginTop: "32px"
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
      <div>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='uncover' width='thin' visible={true} icon='labeled' vertical inverted>
            
            <Menu.Item as={Link} to='home' name='home'>
              <Icon name='home' />
              Home
            </Menu.Item>

            <Menu.Item as={Link} to='work' name='work'>
              <Icon name='industry' />
                Work
            </Menu.Item>

            <Menu.Item as={Link} to='submitted' name='submitted'>
              <Icon name='tasks' />
              Submitted
            </Menu.Item>

            <Menu.Item as={Link} to='excerpts' name='excerpts'>
              <Icon name='folder open' />
              My Excerpts
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