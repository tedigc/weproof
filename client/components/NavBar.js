import React from 'react';
import { Link } from 'react-router';
import AppBar     from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';

const style = {
  color : "white"
};

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
    const guestOptions = (
      <div>
        <FlatButton label="Sign up" style={style} containerElement={<Link to="/signup"/>}/>
        <FlatButton label="Log in" style={style} containerElement={<Link to="/login"/>}/>
      </div>
    );

    const userOptions = (
      <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        <MenuItem primaryText="Settings"/>
        <MenuItem primaryText="Help"/>
        <MenuItem primaryText="Sign out" onClick={this.logout}/>
      </IconMenu>
    );
    return (
      <AppBar title="Individual Project" iconElementRight={ isAuthenticated ? userOptions : guestOptions}/>
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