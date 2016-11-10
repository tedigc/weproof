import React from 'react';
import { Link } from 'react-router';
import AppBar     from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

class NavBar extends React.Component {

  render() {
    return (
      <AppBar
        title="Title"
        iconElementRight={<FlatButton label="Sign up" containerElement={<Link to="/signup"/>}/>}
      />
    );
  }

}

export default NavBar;