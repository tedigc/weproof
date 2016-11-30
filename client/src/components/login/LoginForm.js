import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
import { Button, Card, Form } from 'semantic-ui-react';

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
  }
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
          (res) => { this.context.router.push('/'); },
          (err) => { this.setState({ errors: err.form, isLoading: false}); }
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

  render() {
    return (
      <Card>
        <Card.Content header="Log in"/>
        <Card.Content>
          <Form loading={this.state.isLoading} onSubmit={this.onSubmit}>

            {/* Username / Email */}
            <Form.Field>
              <label>Username / Email</label>
              <input 
              name="identifier" 
              type="text" 
              placeholder='username / user@domain.com' 
              value={this.state.identifier} 
              onChange={this.onChange} 
              />
            </Form.Field>

            {/* Password */}
            <Form.Field>
              <label>Password</label>
              <input 
                name="password"
                type="password"
                placeholder='* * * * * * * *'
                value={this.state.password}
                onChange={this.onChange}
              />
            </Form.Field>

            <Button type='submit' primary>Submit</Button>
            
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