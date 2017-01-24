import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

class PageHeader extends React.Component {

  render() {
    return (
      <Header as='h1'>
        <Icon name={this.props.icon} />
        <Header.Content>
          {this.props.title}
          <Header.Subheader>
            {this.props.description}
          </Header.Subheader>
        </Header.Content>
      </Header>
    );
  }

}

PageHeader.propTypes ={
  icon        : React.PropTypes.string.isRequired,
  title       : React.PropTypes.string.isRequired,
  description : React.PropTypes.string.isRequired,
};

export default PageHeader;