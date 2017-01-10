import React from 'react';
import { Menu, Button, Modal, Header, Icon } from 'semantic-ui-react';
import PageHeader from '../PageHeader';
import SubmitForm from './SubmitForm';

class Excerpts extends React.Component {

  render() {
    return (
      <div>

        <PageHeader 
          title="Excerpts" 
          description="Create and view passages of text for correction." 
          icon="folder open"
        />

        <Menu pointing secondary>
          <Menu.Item name="all"/>
          <Menu.Item name="complete"/>
          <Menu.Item name="pending"/>
          <Menu.Item as={Button} icon="plus" position="right"/>
        </Menu>
        
        <Modal trigger={<Button><Icon name='plus'/>Submit New</Button>} closeIcon='close'>
          <Header icon='write' content='Submit New Excerpt' />
          <Modal.Content>
            <SubmitForm/>
          </Modal.Content>
        </Modal>

      </div>
    );
  }

}

export default Excerpts;