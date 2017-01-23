import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Icon } from 'semantic-ui-react';
import { createExcerpt } from '../../../actions/excerptActions';

const maxTitleLength  =  40;
const maxExcerptLength = 500;

class SubmitForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title     : "",
      excerpt   : "",
      loading   : false,
      submitted : false,
      errors    : {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    if(e.target.name === 'excerpt' && e.target.value.length <= maxExcerptLength) {
      this.setState({ excerpt: e.target.value });
    }
    if(e.target.name === 'title' && e.target.value.length <= maxTitleLength) {
      this.setState({ title: e.target.value });
    } 
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {}, loading: true });
    this.props.createExcerpt({title: this.state.title, excerpt: this.state.excerpt})
      .then(
        (res) => {
          this.setState({ loading: false, submitted: true});
        },
        (err) => {
          this.setState({ loading: false, errors: err });
        });
  }

  render() {
    // Colour the span based on characters remaining
    var charColour = 'gray';
    var remaining = maxExcerptLength - this.state.excerpt.length;
    if(remaining <= 20) {
      charColour = 'red';
    } else if(remaining <= 80) {
      charColour = 'orange';
    }
    var spanStyle = { color: charColour }

    if(this.state.submitted) {
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
        <Form loading={this.state.loading} onSubmit={this.handleSubmit}> 
          <Form.Input name="title" placeholder="Title" value={this.state.title} onChange={this.handleChange} />
          <Form.TextArea name="excerpt" placeholder="Write your excerpt here..." value={this.state.excerpt} onChange={this.handleChange} />
          <Button floated="right" type='submit' primary>Submit</Button>
          <span style={spanStyle} >Characters remaining: {maxExcerptLength - this.state.excerpt.length}</span>
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