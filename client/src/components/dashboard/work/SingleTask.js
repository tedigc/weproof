import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';

class SingleTask extends React.Component {

  render() {

    var cornerIcon;
    switch(this.props.stage) {
      case 'find':
        cornerIcon = 'search';
        break;
      case 'fix':
        cornerIcon = 'write';
        break;
      case 'verify':
        cornerIcon = 'check';
        break;
      default:
        cornerIcon = 'help';
    }

    return (
      <Table.Row>

        <Table.Cell collapsing>
          <Icon.Group size='big'>
            <Icon name='file outline'/>
            <Icon corner name={cornerIcon}/>
          </Icon.Group>
        </Table.Cell>

        <Table.Cell collapsing>{this.props.stage}</Table.Cell>
        <Table.Cell collapsing>{this.props.excerpt.slice(0, Math.min(100, this.props.excerpt.length))}</Table.Cell>
        <Table.Cell collapsing>{this.props.created}</Table.Cell>
        <Table.Cell collapsing><Button content='Start' icon='write'/></Table.Cell>
      </Table.Row>
    );
  }

}

SingleTask.PropTypes = {
  id     : React.PropTypes.number.isRequired,
  stage  : React.PropTypes.string.isRequired,
  excerpt: React.PropTypes.string.isRequired,
  created: React.PropTypes.string.isRequired
};

export default SingleTask;