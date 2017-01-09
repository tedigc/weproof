import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { logout } from '../../actions/authActions';
import { Sidebar, Segment, Menu, Image, Icon, Header } from 'semantic-ui-react';

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
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} animation='uncover' width='thin' visible={true} icon='labeled' vertical inverted>
          <Menu.Item name='home'>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Menu.Item name='gamepad'>
            <Icon name='gamepad' />
            Games
          </Menu.Item>
          <Menu.Item name='camera'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic>
            <Header as='h3'>Application Content</Header>
            <Image src='http://semantic-ui.com/images/wireframe/paragraph.png' />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }

}

Dashboard.propTypes = {
  logout: React.PropTypes.func.isRequired
};

export default connect(null, { logout })(Dashboard);