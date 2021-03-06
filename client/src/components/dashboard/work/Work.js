import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Dimmer, Divider, Icon, Loader, Menu, Table } from 'semantic-ui-react';
import PageHeader from '../PageHeader';
import SingleTask from './SingleTask';
import Error from '../../error/Error';
import { fetchAvailableTasks } from '../../../actions/taskActions';

class Work extends React.Component {

  state = {
    loading : false,
    tasks   : [],
    filter  : 'all',
    error   : undefined
  }

  constructor(props) {

    super(props);
    this.refreshTasks  = this.refreshTasks.bind(this);
    this.setFilter     = this.setFilter.bind(this);
    this.taskTableRows = this.taskTableRows.bind(this);

  }

  componentWillMount() {
    this.refreshTasks();
  }

  refreshTasks(e) {
    if(e !== undefined) e.preventDefault();
    this.setState({ loading : true });
    this.props.fetchAvailableTasks()
      .then(
        (res) => {
          this.setState({ 
            loading : false,
            tasks   : res.data,
          });
        },
        (err) => {
          this.setState({ 
            loading : false, 
            error   : err
          });
          console.error(err);
        }
      );
  }

  setFilter(filter) {
    this.setState({ filter });
  }

  taskTableRows() {

    let { tasks, filter } = this.state;
    let tableRows = [];

    tasks.forEach((task, i) => {

      let { id, stage, body, created_at } = task;
      let createdAtObj = moment(created_at).toDate();

      if(filter === 'all' || filter === stage) {
        let row = (
          <SingleTask
            key={i}
            id={id}
            stage={stage}
            body={body}
            created={createdAtObj.toDateString()}
          />
        );
        tableRows.push(row);
      }

    });

    return tableRows;
  }

  render() {
    let self = this;
    let { filter, error } = this.state;
    let tableComponent;
    let tableRows = this.taskTableRows();

    if(error) {
      tableComponent = <Error icon={error.icon} header={error.header} message={error.message} />;
    } else if(tableRows.length === 0) {
      tableComponent = <Error icon='tasks' header='No Tasks' message='There are no tasks currently available to you. Check back later.' />;
    } else {
      tableComponent = ( 
        <Dimmer.Dimmable as={Table} stackable selectable basic="very" dimmed={this.state.loading}>

          {/* Loading Icon */}
          <Dimmer active={self.state.loading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>

          {/* Table Headers */}
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Stage</Table.HeaderCell>
              <Table.HeaderCell>Preview</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
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
          title="Work" 
          description="Complete correction tasks and earn rewards" 
          icon="industry"
        />

        {/* Filters and refresh button */}
        <Menu secondary>
          <Menu.Item name="all"    active={filter === 'all'}    onClick={() => { this.setFilter('all') }} />
          <Menu.Item name="find"   active={filter === 'find'}   onClick={() => { this.setFilter('find') }} />
          <Menu.Item name="fix"    active={filter === 'fix'}    onClick={() => { this.setFilter('fix') }} />
          <Menu.Item name="verify" active={filter === 'verify'} onClick={() => { this.setFilter('verify') }} />
          <Menu.Item name="refresh" position="right">
            <Button onClick={this.refreshTasks}><Icon name="refresh"/> Refresh</Button>
          </Menu.Item>
        </Menu>

        <Divider/>

        {/* Table or error message */}
        {tableComponent}

      </div>
    );
  }

}

Work.propTypes = {
  fetchAvailableTasks : React.PropTypes.func.isRequired
};

export default connect(null, { fetchAvailableTasks })(Work);