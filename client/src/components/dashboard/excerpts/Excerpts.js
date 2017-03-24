import React from 'react';
import { connect } from 'react-redux';
import { Button, Dimmer, Divider, Header, Icon, Loader, Menu, Modal, Table } from 'semantic-ui-react';
import moment from 'moment';
import PageHeader from '../PageHeader';
import SubmitForm from './SubmitForm';
import { fetchExcerpts, acceptExcerpt } from '../../../actions/excerptActions';
import ExcerptRow from './ExcerptRow';
import Error from '../../error/Error';

class Excerpts extends React.Component {

  state = {
    excerpts : [],
    loading  : true,
    filter   : 'all',
    modalOpen: false,
    error    : undefined
  }

  constructor(props) {
    super(props);
    this.refreshExcerpts          = this.refreshExcerpts.bind(this);
    this.handleOpen               = this.handleOpen.bind(this);
    this.handleClose              = this.handleClose.bind(this);
    this.acceptExcerptCorrections = this.acceptExcerptCorrections.bind(this);
    this.setFilter                = this.setFilter.bind(this);
    this.excerptTableRows         = this.excerptTableRows.bind(this);
  }

  componentWillMount() {
    this.refreshExcerpts();
  }

  refreshExcerpts() {
    this.setState({ loading : true });
    this.props.fetchExcerpts()
      .then(
        (res) => {
          this.setState({
            excerpts: res.data,
            loading : false,
            error   : undefined
          });
        },
        (err) => {
          console.error(err);
          this.setState({
            loading : false,
            error   : err
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

    this.props.acceptExcerpt({ excerptId })
      .then(
        res => {
          let excerpts = this.state.excerpts;
          excerpts[excerptIndex] = res.data.excerptToReturn;
          this.setState(excerpts);
        },
        err => { console.error(err); }
      );

  }

  setFilter(filter) {
    this.setState({ filter });
  }

  excerptTableRows() {
    let self = this;
    let { excerpts, filter } = this.state;


    let tableRows = (
      Object.keys(excerpts).map(function(key, idx) {
        let item = excerpts[key];
        let { id, title, body, owner_id, created_at, heatmap, recommended_edits, stage, accepted } = item.attributes;

        if(filter !== 'all') {
          let status = (accepted) ? 'accepted' : 'pending';
          if(status !== filter) {
            emptyRowCounter++;            
            return undefined;
          }
        }

        let excerpt = {
          id, 
          title, 
          body,
          ownerId : parseInt(owner_id, 10),
          created : moment(created_at).toDate().toDateString(),
          heatmap, 
          recommendedEdits : recommended_edits,
          stage, 
          accepted
        };

        let tasks = {
          tasksFind   : item.tasksFind,
          tasksFix    : item.tasksFix,
          tasksVerify : item.tasksVerify
        };

        return <ExcerptRow
                key={idx}
                excerpt={excerpt}
                tasks={tasks}
                acceptCorrections={self.acceptExcerptCorrections.bind(null, idx, id)}
              />;
      }));
    
    // if none of the rows matched the filter, return an empty array so we can display an error message
    if(tableRows.length === emptyRowCounter) tableRows = [];

    return tableRows;
  }

  render() {
    
    let self = this;
    let { excerpts, loading, filter, error } = this.state;

    let tableRows = this.excerptTableRows();
    let tableComponent;

    if(error) {
      tableComponent = <Error icon={error.icon} header={error.header} message={error.message} />;
    } else if (tableRows.length === 0) {
      tableComponent = <Error icon='file outline' header="No Excerpts" message={(filter === 'all') ? 'You currently have no excerpts. Click the button above to create one.' : 'You have no ' + filter + ' excerpts.'} />;
    } else {
      tableComponent = (
        <Dimmer.Dimmable as={Table} stackable selectable basic="very" dimmed={loading}>

          {/* Loading icon */}
          <Dimmer active={loading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>

          {/* Table Headers */}
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

          {/* Table Rows for each available task */}
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

        {/* Modal for Excerpt Submit Form */}
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
  fetchExcerpts : React.PropTypes.func.isRequired,
  acceptExcerpt : React.PropTypes.func.isRequired
};

export default connect(null, { fetchExcerpts, acceptExcerpt })(Excerpts);