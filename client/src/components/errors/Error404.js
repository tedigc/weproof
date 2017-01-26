import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

class Error404 extends React.Component {

  render() {
    return (
      <Header as='h1' icon textAlign='center' style={{ marginTop: "100px" }}>
        <Icon name='browser' />
        404
        <Header.Subheader>
          The page you requested was not found.
        </Header.Subheader>
      </Header>
    );
  }

}

export default Error404;