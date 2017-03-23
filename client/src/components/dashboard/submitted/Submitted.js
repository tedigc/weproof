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
    this.refreshTasks = this.refreshTasks.bind(this);
  }

  componentWillMount() {
    this.refreshTasks();
  }

  refreshTasks() {
    this.props.fetchTasks(this.state.filter)
      .then(
        res => {          
          let error = undefined;
          if(res.data.tasksFiltered.length === 0) {
            error = {};
            error.icon = 'tasks';
            error.header = 'No tasks';
            error.message = (this.state.filter === 'all') ? 'You have submitted no tasks. Try the "Work" page.' : 'You have no ' + this.state.filter + ' tasks. Check back later.';
          }
          this.setState({ 
            loading : false,
            tasks: res.data.tasksFiltered,
            error
          });
        },
        err => {
          console.error(err);
          this.setState({ loading : false });
        });
  }

  setFilter(filter) {
    this.setState({ filter }, () => this.refreshTasks() );
  }

  render() {
    let self = this;
    let { filter, error } = this.state;

    let tableComponent;
    if(error) {
      tableComponent = <Error icon={error.icon} header={error.header} message={error.message} />;
    } else {
      tableComponent =  <Dimmer.Dimmable as={Table} stackable selectable basic="very" dimmed={this.state.loading}>
                          <Dimmer active={self.state.loading} inverted>
                            <Loader inverted>Loading</Loader>
                          </Dimmer>

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
                          {self.state.tasks.map((task, index) => {
                            let { id, excerpt, created_at } = task;
                            let createdAtObj = moment(created_at).toDate();
                            return <SingleSubmission
                                      key={index}
                                      id={id}
                                      accepted={excerpt.accepted}
                                      body={excerpt.body}
                                      created={createdAtObj.toDateString()}
                                    />;
                          })}
                          </Table.Body>

                        </Dimmer.Dimmable>
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
          <Menu.Item name="pending"  active={filter === 'pending'}  onClick={() => { this.setFilter('pending') }} />
          <Menu.Item name="accepted" active={filter === 'accepted'} onClick={() => { this.setFilter('accepted') }} />
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