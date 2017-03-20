import React from 'react';
import { Button, Table } from 'semantic-ui-react';

class SingleExcerpt extends React.Component {

  render() {
    let { title, body, created, stage, status } = this.props;
    let completedStyle = {
      backgroundColor : '#4096BE',
      color           : '#FFFFFF'
    };

    return (
      <Table.Row>

        <Table.Cell collapsing><b>{title}</b></Table.Cell>
        <Table.Cell collapsing>{body.slice(0, Math.min(50, body.length))}</Table.Cell>
        <Table.Cell collapsing>{created}</Table.Cell>
        <Table.Cell collapsing>{stage}</Table.Cell>
        <Table.Cell collapsing>{status}</Table.Cell>
        <Table.Cell collapsing>
          <Button content='View' icon='search'  style={ stage === 'complete' ? completedStyle : undefined}/>
        </Table.Cell>

      </Table.Row>
    );
  }

}

SingleExcerpt.propTypes ={
  id          : React.PropTypes.number.isRequired,
  title       : React.PropTypes.string.isRequired,
  body        : React.PropTypes.string.isRequired,
  ownerId     : React.PropTypes.number.isRequired,
  created     : React.PropTypes.string.isRequired,
  stage       : React.PropTypes.string.isRequired,
  status      : React.PropTypes.string.isRequired,
  tasksVerify : React.PropTypes.array.isRequired
};

export default SingleExcerpt;