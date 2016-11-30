import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
import { Button, Card, Content, Form, Group, Input } from 'semantic-ui-react';

function validateInput(data) {
  var errors = {};

  // Username validation
  if(Validator.isEmpty(data.username)) {
    errors.username = "Username is required.";
  }
  
  // E-mail validation
  if(!Validator.isEmail(data.email)) {
    errors.email = "E-mail is invalid.";
  }
  if(Validator.isEmpty(data.email)) {
    errors.email = "E-mail is required.";
  }

  // Password
  if(Validator.isEmpty(data.password)) {
    errors.password = "Password is required.";
  }

  // Password confirmation
  if(!Validator.equals(data.password, data.passwordConfirm)) {
    errors.passwordConfirm = "Passwords must match";
  }
  if(Validator.isEmpty(data.passwordConfirm)) {
    errors.passwordConfirm = "Password Confirmation is required.";
  }

  return {
    errors,
    isValid : isEmpty(errors)
  }
}

class SignupForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'email'           : '',
      'username'        : '',
      'password'        : '',
      'passwordConfirm' : '',
      'isLoading'       : false,
      'errors'          : {}
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      this.props.userSignupRequest(this.state)
        .then((res) => {
          this.context.router.push('/');
        })
        .catch((err) => {
          this.setState({ errors : err.response.data, isLoading : false });
        });
    }
  }

  isValid() {
    var validation = validateInput(this.state);
    if(!validation.isValid) {
      this.setState({ errors : validation.errors });
    }
    return validation.isValid;
  }

  render() {
    return (
      <Card style={{ width: 400}}>
        <Card.Content header="Join Our Community"/>
        <Card.Content>
        <Form loading={this.state.isLoading} onSubmit={this.onSubmit}>
          {/* Username */}
          <Form.Field>
            <label>Username</label>
            <input 
            name="username" 
            type="text" 
            placeholder="Username"
            value={this.state.identifier} 
            onChange={this.onChange} 
            />
          </Form.Field>

          {/* Email */}
          <Form.Field>
            <label>Email</label>
            <input 
            name="email" 
            type="email" 
            placeholder="user@domain.com"
            value={this.state.identifier} 
            onChange={this.onChange} 
            />
          </Form.Field>

          <Form.Group widths="equal">
            {/* Password */}
            <Form.Field>
              <label>Password</label>
              <input 
              name="password" 
              type="password" 
              placeholder="* * * * * * * *"
              value={this.state.identifier} 
              onChange={this.onChange} 
              />
            </Form.Field>

            {/* Password Confirmation */}
            <Form.Field>
              <label>Confirm Password</label>
              <input 
              name="passwordConfirm" 
              type="password" 
              placeholder="* * * * * * * *"
              value={this.state.identifier} 
              onChange={this.onChange} 
              />
            </Form.Field>
          </Form.Group>


          <Button type='submit' primary>Submit</Button>
        </Form>
        </Card.Content>
      </Card>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest : React.PropTypes.func.isRequired,
}

SignupForm.contextTypes = {
  router : React.PropTypes.object.isRequired
}

export default SignupForm;
