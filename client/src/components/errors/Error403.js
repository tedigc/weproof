import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

class Error403 extends React.Component {

  render() {
    return (
      <Header as='h1' icon textAlign='center' style={{ marginTop: "100px" }}>
        <Icon name='browser' />
        403
        <Header.Subheader>
          You don't have access to that page.
        </Header.Subheader>
      </Header>
    );
  }

}

export default Error403;