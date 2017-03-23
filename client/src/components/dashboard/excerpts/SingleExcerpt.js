import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import ExcerptSummary from './ExcerptSummary';

class SingleExcerpt extends React.Component {

  state = {
    modalOpen : false
  }

  constructor(props) {
    super(props);
    this.handleOpen  = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen(e) {
    this.setState({
      modalOpen: true
    });
  }

  handleClose(e) {
    this.setState({
      modalOpen: false
    });
  }

  render() {
    let { excerpt, tasks, acceptCorrections } = this.props;
    let { title, body, created, stage, status } = excerpt;
    let completedStyle = { backgroundColor : '#4096BE', color : '#FFFFFF' };

    return (
      <Table.Row>

        <Table.Cell collapsing><b>{title}</b></Table.Cell>
        <Table.Cell collapsing>{body.slice(0, Math.min(50, body.length))}</Table.Cell>
        <Table.Cell collapsing>{created}</Table.Cell>
        <Table.Cell collapsing>{stage}</Table.Cell>
        <Table.Cell collapsing>{status}</Table.Cell>
        <Table.Cell collapsing>
          <Button content='View' icon='search' onClick={this.handleOpen} style={ stage === 'complete' ? completedStyle : undefined}/>
        </Table.Cell>

        <ExcerptSummary
          isOpen={this.state.modalOpen}
          excerpt={excerpt}
          close={this.handleClose}
          tasks={tasks}
          acceptCorrections={acceptCorrections}
        />

      </Table.Row>
    );
  }

}

SingleExcerpt.propTypes = {
  excerpt           : React.PropTypes.object.isRequired,
  tasks             : React.PropTypes.object.isRequired,
  acceptCorrections : React.PropTypes.func.isRequired
};

export default SingleExcerpt;