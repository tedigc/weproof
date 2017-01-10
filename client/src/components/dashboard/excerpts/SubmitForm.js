import React from 'react';
import { Button, Form } from 'semantic-ui-react';

const maxExcerptLength = 500;

class SubmitForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      excerpt: "",
      loading: false,
      errors : {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    if(e.target.name === 'excerpt' && e.target.value.length <= maxExcerptLength) {
      this.setState({excerpt: e.target.value});
    }
  }

  handleSubmit() {

  }

  render() {

    var charColour = 'gray';
    var remaining = maxExcerptLength - this.state.excerpt.length;
    if(remaining <= 20) {
      charColour = 'red';
    } else if(remaining <= 80) {
      charColour = 'orange';
    }
    var spanStyle = {
      color: charColour
    }

    console.log(spanStyle);

    return (
      <Form loading={this.state.loading} onSubmit={this.handleSubmit}> 
        <span style={spanStyle} >Characters remaining: {maxExcerptLength - this.state.excerpt.length}</span>
        <Form.TextArea name="excerpt" placeholder="Write your excerpt here..." value={this.state.excerpt} onChange={this.handleChange} />
        <Button type='submit' primary>Submit</Button>
      </Form>
    );
  }

}

export default SubmitForm;