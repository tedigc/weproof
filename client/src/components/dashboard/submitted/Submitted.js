import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PageHeader from '../PageHeader';
import { Button, Divider, Dimmer, Icon, Loader, Menu, Table } from 'semantic-ui-react';
import { fetchTasks } from '../../../actions/taskActions';
import SingleSubmission from './SingleSubmission';
import Error from '../../error/Error';

class Submitted extends React.Component {

  state = {
    loading : true,
    tasks   : [],
    filter  : 'all',
    error   : undefined
  }

  constructor(props) {
    super(props);
    this.refreshTasks        = this.refreshTasks.bind(this);
    this.submissionTableRows = this.submissionTableRows.bind(this);
  }

  componentWillMount() {
    this.refreshTasks();
  }

  refreshTasks() {
    this.props.fetchTasks()
      .then(
        res => {
          this.setState({ 
            loading : false,
            tasks: res.data.tasks,
          });
        },
        err => {
          console.error(err);
          this.setState({ 
            loading : false,
            error   : err
          });
      });
  }

  setFilter(filter) {
    this.setState({ filter });
  }

  submissionTableRows() {

    let { tasks, filter } = this.state;
    let emptyRowCounter;
    let tableRows = [];

    tasks.forEach((task, i) => {

      let { id, excerpt, created_at } = task;
      let createdAtObj = moment(created_at).toDate();
      let acceptedString = (excerpt.accepted) ? 'accepted' : 'pending';

      if(filter === 'all' || filter === acceptedString) {
        let row = (
          <SingleSubmission
            key={i}
            id={id}
            accepted={excerpt.accepted}
            body={excerpt.body}
            created={createdAtObj.toDateString()}
          />
        );
        tableRows.push(row);
      }

    });

    return tableRows;
  }

  render() {

    let { loading, filter, error } = this.state;
    let tableComponent;
    let tableRows = this.submissionTableRows();

    if(error) {
      tableComponent = <Error icon={error.icon} header={error.header} message={error.message} />;
    } else if(tableRows.length === 0){
      tableComponent = <Error icon='tasks' header='No Submissions' message='ayy lmao' />
    } else {
      tableComponent =  (
        <Dimmer.Dimmable as={Table} stackable selectable basic="very" dimmed={loading}>

          {/* Loading Icon */}
          <Dimmer active={loading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>

          {/* Table Headers */}
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Preview</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {/* Item list of available tasks */}
          <Table.Body>
          {tableRows}
          </Table.Body>

        </Dimmer.Dimmable>
      );
    }
    return (
      <div>

        {/* Header */}
        <PageHeader 
          title="Submitted" 
          description="View the tasks you have completed and submitted in detail" 
          icon="tasks"
        />

        {/* Filters & Refresh button */}
        <Menu secondary>
          <Menu.Item name="all"      active={filter === 'all'}      onClick={() => { this.setFilter('all') }} />
          <Menu.Item name="accepted" active={filter === 'accepted'} onClick={() => { this.setFilter('accepted') }} />
          <Menu.Item name="pending"  active={filter === 'pending'}  onClick={() => { this.setFilter('pending') }} />
          <Menu.Item name="refresh" position="right">
            <Button onClick={this.refreshTasks}><Icon name="refresh"/> Refresh</Button>
          </Menu.Item>
        </Menu>

        <Divider/>

        {/* Table or error component */}
        {tableComponent}

      </div>
    );
  }

}

Submitted.propTypes = {
  fetchTasks : React.PropTypes.func.isRequired
};

export default connect(null, { fetchTasks })(Submitted);