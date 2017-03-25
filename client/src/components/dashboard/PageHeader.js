import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

class PageHeader extends React.Component {

  render() {

    let { icon, title, description } = this.props;

    return (
      <Header as='h1'>
        <Icon name={icon} />
        <Header.Content>
          {title}
          <Header.Subheader>
            {description}
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