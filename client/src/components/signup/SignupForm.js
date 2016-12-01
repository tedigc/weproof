import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
import { Button, Card, Form } from 'semantic-ui-react';

const errorMessageStyle = {
  color: 'red'
};

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

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    if(!!this.state.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors[e.target.name];
      this.setState({
        [e.target.name] : e.target.value,
        errors
      });
    } else {
      this.setState({
        [e.target.name] : e.target.value,
      });
    }

  }

  handleSubmit(e) {
    e.preventDefault();
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
          <Form loading={this.state.isLoading} onSubmit={this.handleSubmit}>
            {/* Username */}
            <Form.Field>
              <label>Username</label>
              <Form.Input
              name="username" 
              type="text" 
              placeholder="Username"
              value={this.state.identifier} 
              onChange={this.handleChange}
              error={!!this.state.errors.username}
              />
              <span style={errorMessageStyle}>{this.state.errors.username}</span>
            </Form.Field>

            {/* Email */}
            <Form.Field>
              <label>Email</label>
              <Form.Input 
              name="email" 
              type="email" 
              placeholder="user@domain.com"
              value={this.state.identifier} 
              onChange={this.handleChange} 
              error={!!this.state.errors.email}
              />
              <span style={errorMessageStyle}>{this.state.errors.email}</span>
            </Form.Field>

            <Form.Group widths="equal">
              {/* Password */}
              <Form.Field>
                <label>Password</label>
                <Form.Input 
                name="password" 
                type="password" 
                placeholder="* * * * * * * *"
                value={this.state.identifier} 
                onChange={this.handleChange}
                error={!!this.state.errors.password}
                />
                <span style={errorMessageStyle}>{this.state.errors.password}</span>
              </Form.Field>

              {/* Password Confirmation */}
              <Form.Field>
                <label>Confirm Password</label>
                <Form.Input 
                name="passwordConfirm" 
                type="password" 
                placeholder="* * * * * * * *"
                value={this.state.identifier} 
                onChange={this.handleChange} 
                error={!!this.state.errors.passwordConfirm}
                />
                <span style={errorMessageStyle}>{this.state.errors.passwordConfirm}</span>
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
