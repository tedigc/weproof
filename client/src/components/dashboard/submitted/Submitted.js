import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../PageHeader';
import { Button, Divider, Menu } from 'semantic-ui-react';
import { fetchTasks } from '../../../actions/taskActions';

class Submitted extends React.Component {

  componentWillMount() {
    this.props.fetchTasks()
      .then(
        res => {
          console.log(res.data);
        },
        err => {
          console.error(err);
        });
      
  }

  render() {
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

      </div>
    );
  }

}

Submitted.propTypes = {
  fetchTasks : React.PropTypes.func.isRequired
};

export default connect(null, { fetchTasks })(Submitted);