import React from 'react';
import { Button, Header, Table } from 'semantic-ui-react';

const PRICE_PER_TASK = 0.08;

const styles = {
  rowValue : { color : '#999999', textAlign : 'right'}
};

class Summary extends React.Component {

  render() {
    let { complete, accepted, dateCreated, dateCompleted, length, nTasksFind, nTasksFix, nTasksVerify } = this.props;
    let nTotalTasks = nTasksFind + nTasksFix + nTasksVerify;
    let cost = '£' + (nTotalTasks * PRICE_PER_TASK).toFixed(2);
    let { rowName, rowValue } = styles;

    console.log(accepted);

    let acceptButton = (
      <Button 
        fluid 
        style={{ backgroundColor : '#4096BE', color : '#FFFFFF'}} 
        disabled={!complete} 
        onClick={this.props.acceptCorrections}
      >
          Accept
      </Button>
    );

    let displayButton = (accepted) ? undefined : acceptButton;

    return (
      <div>
        <Header content='Summary'/>
        <Table compact='very' basic='very' selectable>

          <Table.Row>
            <Table.Cell style={rowName}>Created</Table.Cell>
            <Table.Cell style={rowValue}>{dateCreated}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell style={rowName}>Completed</Table.Cell>
            <Table.Cell style={rowValue}>{dateCompleted}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell style={rowName}>Length</Table.Cell>
            <Table.Cell style={rowValue}>{length}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell style={rowName}>Total Tasks</Table.Cell>
            <Table.Cell style={rowValue}>{nTotalTasks}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell style={rowName}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Find Tasks</Table.Cell>
            <Table.Cell style={rowValue}>{nTasksFind}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell style={rowName}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Fix Tasks</Table.Cell>
            <Table.Cell style={rowValue}>{nTasksFix}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell style={rowName}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Verify Tasks</Table.Cell>
            <Table.Cell style={rowValue}>{nTasksVerify}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell style={rowName}>Cost</Table.Cell>
            <Table.Cell style={rowValue}>{cost}</Table.Cell>
          </Table.Row>

        </Table>

        {displayButton}

      </div>
    );
  }

}

Summary.propTypes = {
  complete          : React.PropTypes.bool.isRequired,
  accepted          : React.PropTypes.bool.isRequired,
  dateCreated       : React.PropTypes.string.isRequired,
  dateCompleted     : React.PropTypes.string.isRequired,
  length            : React.PropTypes.number.isRequired,
  nTasksFind        : React.PropTypes.number.isRequired,
  nTasksFix         : React.PropTypes.number.isRequired,
  nTasksVerify      : React.PropTypes.number.isRequired,
  acceptCorrections : React.PropTypes.func.isRequired
};

export default Summary;