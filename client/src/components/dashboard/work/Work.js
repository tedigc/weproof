import React from 'react';
import { connect } from 'react-redux';
import { Button, Dimmer, Divider, Loader, Menu, Table } from 'semantic-ui-react';
import PageHeader from '../PageHeader';
import SingleTask from './SingleTask';
import { fetchAvailableTasks } from '../../../actions/taskActions';

/**

TODO

- properly display errors
- fix console error to do with nested divs, tables and dimmers
- show special message if no tasks are available

*/

class Work extends React.Component {

  state = {
    loading : false,
    tasks   : [],
    filter  : 'all'
  }

  constructor(props) {
    super(props);
    this.refreshTasks = this.refreshTasks.bind(this);
    this.setFilter = this.setFilter.bind(this);
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
            tasks   : res.data
          });
        },
        (err) => {
          this.setState({ loading : false });
          console.error(err);
        }
      );
  }

  setFilter(filter) {
    if(filter === 'all')    this.setState({ filter: 'all' });
    if(filter === 'find')   this.setState({ filter: 'find' });
    if(filter === 'fix')    this.setState({ filter: 'fix' });
    if(filter === 'verify') this.setState({ filter: 'verify' });
  }

  render() {
    let self = this;
    let { filter } = this.state;
    return (
      <div>
        <PageHeader 
          title="Work" 
          description="Complete correction tasks and earn rewards" 
          icon="industry"
        />

        <Menu secondary>
          <Menu.Item name="all"    active={filter === 'all'}    onClick={() => { this.setFilter('all') }} />
          <Menu.Item name="find"   active={filter === 'find'}   onClick={() => { this.setFilter('find') }} />
          <Menu.Item name="fix"    active={filter === 'fix'}    onClick={() => { this.setFilter('fix') }} />
          <Menu.Item name="verify" active={filter === 'verify'} onClick={() => { this.setFilter('verify') }} />
          <Menu.Item name="refresh" position="right" as={Button} icon="refresh" onClick={this.refreshTasks} />
        </Menu>

        <Divider/>

        <Dimmer.Dimmable as={Table} stackable selectable basic="very" dimmed={this.state.loading}>
          <Dimmer active={self.state.loading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>

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
          {self.state.tasks.map((task, index) => {
            if(self.state.filter !== 'all' && self.state.filter !== task.stage) return undefined
            else return <SingleTask
                          key={index}
                          id={task.id}
                          stage={task.stage}
                          excerpt={task.excerpt}
                          created={task.created_at}
                        />;
          })}
          </Table.Body>

        </Dimmer.Dimmable>

      </div>
    );
  }

}

Work.propTypes = {
  fetchAvailableTasks : React.PropTypes.func.isRequired
};

export default connect(null, { fetchAvailableTasks })(Work);