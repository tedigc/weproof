import React from 'react';
import { connect } from 'react-redux';
// import { Menu, Button, Modal, Header, Icon, Dimmer, Loader, Item } from 'semantic-ui-react';
import { Button, Dimmer, Divider, Header, Icon, Loader, Menu, Modal, Table } from 'semantic-ui-react';
import moment from 'moment';
import PageHeader from '../PageHeader';
import SubmitForm from './SubmitForm';
import { fetchExcerpts } from '../../../actions/excerptActions';
import SingleExcerpt from './SingleExcerpt';
import Error from '../../error/Error';
import ExcerptSummary from './ExcerptSummary';

class Excerpts extends React.Component {

    state = {
      excerpts : [],
      loading  : true,
      modalOpen: false,
      error    : {}
    }

  constructor(props) {
    super(props);
    this.refreshExcerpts = this.refreshExcerpts.bind(this);
    this.handleOpen      = this.handleOpen.bind(this);
    this.handleClose     = this.handleClose.bind(this);
  }

  componentWillMount() {
    this.refreshExcerpts();
  }

  refreshExcerpts() {
    this.setState({loading: true});
    this.props.fetchExcerpts()
      .then(
        (res) => {
          this.setState({
            excerpts: res.data,
            loading : false
          });
        },
        (err) => {
          console.error(err);
          this.setState({
            loading : false
          });
        }
      );
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
  
  acceptExcerptCorrections(excerptIndex, excerptId) {
    console.log(excerptIndex);
    console.log(excerptId);
  }

  render() {
    let self = this;
    let { filter, error } = this.state;
    let tableComponent;
    // if(error) {
    //   tableComponent = <Error icon={error.icon} header={error.header} message={error.message} />;
    // } else {
      tableComponent = <Dimmer.Dimmable as={Table} stackable selectable basic="very" dimmed={this.state.loading}>
                          <Dimmer active={self.state.loading} inverted>
                            <Loader inverted>Loading</Loader>
                          </Dimmer>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Title</Table.HeaderCell>
                              <Table.HeaderCell>Preview</Table.HeaderCell>
                              <Table.HeaderCell>Created</Table.HeaderCell>
                              <Table.HeaderCell>Stage</Table.HeaderCell> 
                              <Table.HeaderCell>Status</Table.HeaderCell>
                              <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>

                          {/* Item list of available tasks */}
                          <Table.Body>
                            {Object.keys(self.state.excerpts).map(function(key, idx) {
                              let item = self.state.excerpts[key];
                              let { id, title, body, owner_id, created_at, heatmap, recommended_edits, stage, status } = item.attributes;
                              let tasks = {
                                tasksFind   : item.tasksFind,
                                tasksFix    : item.tasksFix,
                                tasksVerify : item.tasksVerify
                              };
                              let createdAtObj = moment(created_at).toDate();

                              return <SingleExcerpt
                                      key={idx}
                                      id={id}
                                      title={title}
                                      body={body}
                                      ownerId={parseInt(owner_id, 10)}
                                      created={createdAtObj.toDateString()}
                                      recommendedEdits={recommended_edits}
                                      heatmap={heatmap}
                                      stage={stage}
                                      status={status}
                                      tasks={tasks}
                                      acceptCorrections={self.acceptExcerptCorrections.bind(null, idx, id)}
                                    />
                            })}
                          </Table.Body>
                        </Dimmer.Dimmable>
    // }

    return (
      <div>

        {/* Header */}
        <PageHeader 
          title="Excerpts" 
          description="Create and view passages of text for correction." 
          icon="folder open"
        />

        {/* Button to open up 'create excerpt' modal */}
        <Button onClick={this.handleOpen}><Icon name='plus'/>Create New</Button>

        {/* Filters and refresh button */}
        <Menu secondary>
          <Menu.Item name="all"      active={filter === 'all'}      onClick={() => { this.setFilter('all') }} />
          <Menu.Item name="complete" active={filter === 'complete'} onClick={() => { this.setFilter('complete') }} />
          <Menu.Item name="pending"  active={filter === 'pending'}  onClick={() => { this.setFilter('pending') }} />
          <Menu.Item name="refresh" position="right">
            <Button onClick={this.refreshExcerpts}><Icon name="refresh"/> Refresh</Button>
          </Menu.Item>
        </Menu>

        <Divider/>

        {/* Table or error message */}
        {tableComponent}

        <Modal 
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon='close'>
          <Header icon='write' content='Submit New Excerpt' />
          <Modal.Content>
            <SubmitForm/>
          </Modal.Content>
        </Modal>

      </div>
    );
  }

}

Excerpts.propTypes ={
  fetchExcerpts: React.PropTypes.func.isRequired
};

export default connect(null, { fetchExcerpts })(Excerpts);