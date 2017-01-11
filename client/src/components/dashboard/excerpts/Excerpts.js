import React from 'react';
import { connect } from 'react-redux';
import { Menu, Button, Modal, Header, Icon, Container, Dimmer, Loader, Item } from 'semantic-ui-react';
import PageHeader from '../PageHeader';
import SubmitForm from './SubmitForm';
import { fetchExcerpts } from '../../../actions/excerptActions';
import SingleExcerpt from './SingleExcerpt';

class Excerpts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      excerpts : {},
      loading  : true,
      modalOpen: false
    };
    this.handleOpen  = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
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

  render() {
    var self = this;
    return (
      <div>

        <PageHeader 
          title="Excerpts" 
          description="Create and view passages of text for correction." 
          icon="folder open"
        />

        <Button onClick={this.handleOpen}><Icon name='plus'/>Create New</Button>

        <Menu pointing secondary>
          <Menu.Item name="all"/>
          <Menu.Item name="complete"/>
          <Menu.Item name="pending"/>
          <Menu.Item name="refresh" position="right" as={Button} icon="refresh" />
        </Menu>

        <Container fluid>
          <Dimmer active={this.state.loading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          <Item.Group divided>
          {Object.keys(self.state.excerpts).map(function(key) {
            var item = self.state.excerpts[key];
            return <SingleExcerpt
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    excerpt={item.excerpt}
                    ownerId={item.ownerId}
                    created={item.created_at}
                  />
          })}
          </Item.Group>
        </Container>
        
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

Excerpts.PropTypes = {
  fetchExcerpts: React.PropTypes.func.isRequired
};

export default connect(null, { fetchExcerpts })(Excerpts);