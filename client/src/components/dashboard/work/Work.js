import React from 'react';
import { connect } from 'react-redux';
import { Button, Dimmer, Divider, Loader, Menu, Table } from 'semantic-ui-react';
import PageHeader from '../PageHeader';
import SingleTask from './SingleTask';
import { fetchTasks } from '../../../actions/taskActions';

class Work extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tasks  : []
    };
    this.refreshTasks = this.refreshTasks.bind(this);
  }

  componentWillMount() {
    this.refreshTasks();
  }

  refreshTasks() {
    this.setState({ loading : true });
    this.props.fetchTasks()
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

  render() {
    var self = this;
    return (
      <div>
        <PageHeader 
          title="Work" 
          description="Complete correction tasks and earn rewards!" 
          icon="industry"
        />

        <Menu secondary>
          <Menu.Item name="all"/>
          <Menu.Item name="find"/>
          <Menu.Item name="fix"/>
          <Menu.Item name="verify"/>
          <Menu.Item name="refresh" position="right" as={Button} onClick={this.refreshExcerpts} icon="refresh" />
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
            return <SingleTask
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

Work.PropTypes = {
  fetchTasks : React.PropTypes.func.isRequired
};

export default connect(null, { fetchTasks })(Work);

// {/* Item list of available tasks */}
//           {self.state.tasks.map((task, index) => {
//             return <SingleTask
//                       key={index}
//                       id={task.id}
//                       stage={task.stage}
//                       excerpt={task.excerpt}
//                       created={task.created_at}
//                     />;
//           })}