import React from 'react';
import { Icon, Table } from 'semantic-ui-react';

class SingleSubmission extends React.Component {

  render() {

    let cornerIcon;
    switch(this.props.status) {
      case 'accepted':
        cornerIcon = 'check';
        break;
      case 'rejected':
        cornerIcon = 'cross';
        break;
      case 'pending':
        cornerIcon = 'wait';
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

        <Table.Cell collapsing>{this.props.status}</Table.Cell>
        <Table.Cell collapsing>{this.props.excerpt.slice(0, Math.min(100, this.props.excerpt.length))}</Table.Cell>
        <Table.Cell collapsing>{this.props.created}</Table.Cell>
      </Table.Row>
    );
  }

}

SingleSubmission.propTypes = {
  id      : React.PropTypes.number.isRequired,
  excerpt : React.PropTypes.string.isRequired,
  status  : React.PropTypes.string.isRequired,
  created : React.PropTypes.string.isRequired
};

export default SingleSubmission;