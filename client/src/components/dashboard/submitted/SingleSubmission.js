import React from 'react';
import { Icon, Table } from 'semantic-ui-react';

class SingleSubmission extends React.Component {

  render() {
    let { body, created, accepted } = this.props;
    let icon = (accepted) ? 'check' : 'wait';

    return (
      <Table.Row>

        <Table.Cell collapsing><Icon name={icon} size='big'/></Table.Cell>
        <Table.Cell collapsing>{(accepted) ? 'accepted' : 'pending'}</Table.Cell>
        <Table.Cell collapsing>{body.slice(0, Math.min(100, body.length))}</Table.Cell>
        <Table.Cell collapsing>{created}</Table.Cell>

      </Table.Row>
    );
  }

}

SingleSubmission.propTypes = {
  id       : React.PropTypes.number.isRequired,
  body     : React.PropTypes.string.isRequired,
  created  : React.PropTypes.string.isRequired,
  accepted : React.PropTypes.bool.isRequired
};

export default SingleSubmission;