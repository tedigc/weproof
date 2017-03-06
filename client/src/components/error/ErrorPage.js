import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

class ErrorPage extends React.Component {

  render() {
    let { code, message } = this.props;
    return (
      <Header as='h1' icon textAlign='center' style={{ marginTop: "100px" }}>
        <Icon name='browser' />
        {code}
        <Header.Subheader>
          {message}
        </Header.Subheader>
      </Header>
    );
  }

}

ErrorPage.propTypes = {
  code    : React.PropTypes.number.isRequired,
  message : React.PropTypes.string.isRequired
};

export default ErrorPage;