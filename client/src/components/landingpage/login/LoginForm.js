import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../../actions/authActions';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
import { Button, Card, Form, Message } from 'semantic-ui-react';

function validateInput(data) {
  var errors = {};

  // Identifier validation
  if(Validator.isEmpty(data.identifier)) {
    errors.identifier = "This field is required.";
  }

  // Password validation
  if(Validator.isEmpty(data.password)) {
    errors.password = "This field is required.";
  }

  return {
    errors,
    isValid : isEmpty(errors)
  };
}

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      identifier  : '',
      password  : '',
      isLoading : false,
      errors    : {}
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isValid  = this.isValid.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.isValid()) {
      this.setState({ errors : {}, isLoading : true });
      this.props.login(this.state)
        .then(
          (res) => { 
            this.context.router.push('/dashboard/home'); 
          },
          (err) => { 
            this.setState({ errors: err.response.data.errors, isLoading: false}); 
          }
        );
    }
  }

  isValid() {
    var validation = validateInput(this.state);
    if(!validation.isValid) {
      this.setState({ errors : validation.errors });
    }
    return validation.isValid;
  }

  renderErrorMessage() {
    if(this.state.errors.form) {
      return <Message
        error
        header="Oops! Something went wrong."
        content={this.state.errors.form}
      />
    } else {
      return '';
    }
  }

  render() {
    return (
      <Card style={{ marginTop: 100, width: 400}}>
        <Card.Content header="Log in"/>
        <Card.Content>
          {this.renderErrorMessage()}
          <Form loading={this.state.isLoading} onSubmit={this.onSubmit}>
            {/* Username / Email */}
            <Form.Field>
              <label>Username / Email</label>
              <Form.Input 
              name="identifier" 
              type="text" 
              placeholder='username / user@domain.com' 
              value={this.state.identifier}
              onChange={this.onChange} 
              error={!!this.state.errors.identifier}
              />
            </Form.Field>

            {/* Password */}
            <Form.Field>
              <label>Password</label>
              <Form.Input 
                name="password"
                type="password"
                placeholder='* * * * * * * *'
                value={this.state.password}
                onChange={this.onChange}
                error={!!this.state.errors.password}
              />
            </Form.Field>

            <Button style={{ backgroundColor: '#4096BE' }} floated='right' type='submit' primary>Submit</Button>
            
          </Form>
        </Card.Content>
      </Card>
    );
  }

}

LoginForm.propTypes = {
  login : React.PropTypes.func.isRequired
};

LoginForm.contextTypes = {
  router : React.PropTypes.object.isRequired 
}

export default connect(null, { login })(LoginForm);