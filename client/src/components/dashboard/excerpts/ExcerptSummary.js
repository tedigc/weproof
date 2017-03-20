import React from 'react';
import { Header, Modal } from 'semantic-ui-react';

class ExcerptSummary extends React.Component {

  render() {
    let { isOpen, close, title, body, created } = this.props;
    return (
      <Modal 
        open={isOpen}
        onClose={close}
        closeIcon='close'>
        <Header icon='write' content={title} />
        <Modal.Content>
          {body}
        </Modal.Content>
      </Modal>
    );
  }

}

ExcerptSummary.propTypes = {
  isOpen  : React.PropTypes.bool.isRequired,
  title   : React.PropTypes.string.isRequired,
  body    : React.PropTypes.string.isRequired,
  created : React.PropTypes.string.isRequired,
  close   : React.PropTypes.func.isRequired
};

export default ExcerptSummary;