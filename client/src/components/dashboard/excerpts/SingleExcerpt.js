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
    let { title, body, created, recommendedEdits, heatmap, stage, status, tasks, acceptCorrections } = this.props;
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
          <Button content='View' icon='search' onClick={this.handleOpen} style={ stage === 'complete' ? completedStyle : undefined}/>
        </Table.Cell>

        <ExcerptSummary
          isOpen={this.state.modalOpen}
          title={title}
          body={body}
          created={created}
          recommendedEdits={recommendedEdits}
          heatmap={heatmap}
          stage={stage}
          status={status}
          close={this.handleClose}
          tasks={tasks}
          acceptCorrections={acceptCorrections}
        />

      </Table.Row>
    );
  }

}

SingleExcerpt.propTypes ={
  id                : React.PropTypes.number.isRequired,
  title             : React.PropTypes.string.isRequired,
  body              : React.PropTypes.string.isRequired,
  ownerId           : React.PropTypes.number.isRequired,
  created           : React.PropTypes.string.isRequired,
  recommendedEdits  : React.PropTypes.array.isRequired,
  heatmap           : React.PropTypes.array.isRequired,
  stage             : React.PropTypes.string.isRequired,
  status            : React.PropTypes.string.isRequired,
  tasks             : React.PropTypes.object.isRequired,
  acceptCorrections : React.PropTypes.func.isRequired
};

export default SingleExcerpt;