import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../PageHeader';
import { Button, Divider, Dimmer, Loader, Menu, Table } from 'semantic-ui-react';
import { fetchTasks } from '../../../actions/taskActions';
import SingleSubmission from './SingleSubmission';

class Submitted extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading         : true,
      taskSubmissions : []
    };
  }

  componentWillMount() {
    this.props.fetchTasks()
      .then(
        res => {
          console.log(res);
          this.setState({ 
            loading : false,
            taskSubmissions: res.data.taskSubmissions
          });
        },
        err => {
          console.error(err);
          this.setState({ loading : false });
        });
  }

  render() {
    let self = this;
    return (
      <div>
        <PageHeader 
          title="Submitted" 
          description="View the tasks you have completed and submitted in detail" 
          icon="tasks"
        />

        <Menu secondary>
          <Menu.Item name="all"/>
          <Menu.Item name="pending"/>
          <Menu.Item name="accepted"/>
          <Menu.Item name="rejected"/>
          <Menu.Item name="refresh" position="right" as={Button} icon="refresh" />
        </Menu>

        <Divider/>

        <Dimmer.Dimmable as={Table} stackable selectable basic="very" dimmed={this.state.loading}>
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
          {self.state.taskSubmissions.map((taskSubmission, index) => {
            console.log(taskSubmission);
            return <SingleSubmission
                      key={index}
                      id={taskSubmission.id}
                      status={taskSubmission.excerpt.status}
                      excerpt={taskSubmission.excerpt.excerpt}
                      created={taskSubmission.created_at}
                    />;
          })}
          </Table.Body>

        </Dimmer.Dimmable>

      </div>
    );
  }

}

Submitted.propTypes = {
  fetchTasks : React.PropTypes.func.isRequired
};

export default connect(null, { fetchTasks })(Submitted);