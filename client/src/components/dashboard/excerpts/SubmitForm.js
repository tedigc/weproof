import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Icon } from 'semantic-ui-react';
import { createExcerpt } from '../../../actions/excerptActions';

const MAX_TITLE_LENGTH   =  40;
const MAX_EXCERPT_LENGTH = 600;

class SubmitForm extends React.Component {

  state = {
    title     : "",
    body      : "",
    loading   : false,
    submitted : false,
    errors    : {}
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    if(e.target.name === 'body') {
      this.setState({ body: e.target.value });
    }
    if(e.target.name === 'title' && e.target.value.length <= MAX_TITLE_LENGTH) {
      this.setState({ title: e.target.value });
    } 
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {}, loading: true });
    this.props.createExcerpt({title: this.state.title, body: this.state.body})
      .then(
        (res) => {
          this.setState({ loading: false, submitted: true});
        },
        (err) => {
          this.setState({ loading: false, errors: err });
        });
  }

  render() {

    let { loading, title, body, submitted } = this.state;

    // Colour the span based on characters remaining
    let charColour = 'gray';
    let remaining = MAX_EXCERPT_LENGTH - body.length;
    if     (remaining <= 20) charColour = 'red';
    else if(remaining <= 80) charColour = 'orange';
    let spanStyle = { color : charColour }

    if(submitted) {
      return (
        <Header as='h2' textAlign="center" icon>
          <Icon name='check' />
          Submitted!
          <Header.Subheader>
            Your excerpt has been submitted. Check back soon for corrections.
          </Header.Subheader>
        </Header>
      );
    } else {
      return (
        <Form loading={loading} onSubmit={this.handleSubmit}> 
          <Form.Input name="title" placeholder="Title" value={title} onChange={this.handleChange} />
          <Form.TextArea name="body" placeholder="Write your excerpt here..." value={body} onChange={this.handleChange} />
          <Button floated="right" type='submit' style={{ backgroundColor : '#4096BE', color : '#FFFFFF'}} disabled={(remaining < 0)}>Submit</Button>
          <span style={spanStyle} >Characters remaining: {MAX_EXCERPT_LENGTH - body.length}</span>
        </Form>
      );
    }
  }

}

SubmitForm.propTypes = {
  createExcerpt: React.PropTypes.func.isRequired
};

SubmitForm.contextTypes = {
  router : React.PropTypes.object.isRequired 
};
export default connect(null, { createExcerpt })(SubmitForm);