import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

class Error extends React.Component {
    
  render() {
    let { icon, header, message } = this.props;
    return (
      <Header as='h2' icon textAlign='center'>
        <Icon name={icon}/>
        {header}
        <Header.Subheader>
          {message}
        </Header.Subheader>
      </Header>
    );
  }

}

Error.propTypes = {
  icon    : React.PropTypes.string.isRequired,
  header  : React.PropTypes.string.isRequired,
  message : React.PropTypes.string.isRequired
}

export default Error;