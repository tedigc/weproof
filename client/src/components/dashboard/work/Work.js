import React from 'react';
import { connect } from 'react-redux';
import { Dimmer, Item, Loader } from 'semantic-ui-react';
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
    console.log('loaded');
    this.refreshTasks();
  }

  refreshTasks() {
    this.setState({ loading : true });
    console.log('refreshing');
    this.props.fetchTasks()
      .then(
        (res) => {
          this.setState({ 
            loading : false,
            tasks   : res.data
          });
          console.log('finished');
          console.log(res.data);
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

        <Dimmer.Dimmable as={Item.Group} divided dimmed={this.state.loading}>
          <Dimmer active={self.state.loading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>

          {/* Item list of available tasks */}
          {self.state.tasks.map((task, index) => {
            return <SingleTask
                      key={index}
                    />;
          })}

        </Dimmer.Dimmable>

      </div>
    );
  }

}

Work.PropTypes = {
  fetchTasks : React.PropTypes.func.isRequired
};

export default connect(null, { fetchTasks })(Work);