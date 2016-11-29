import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField  from 'material-ui/TextField';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

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
        <CardTitle title="Log in"/>
        <CardText>
          <form onSubmit={this.onSubmit}>

            <div style={{ display: "flex", flexDirection: "column"}}>
              
              {/* Username field */}
              <TextField
                value={this.state.identifier} 
                onChange={this.onChange}
                name="identifier"  
                hintText="Username / Email"
                type="text"
                errorText={this.state.errors.identifier}
              />

              {/* Password field */}
              <TextField
                value={this.state.password} 
                onChange={this.onChange}
                name="password"  
                hintText="Password"
                type="password"
                errorText={this.state.errors.password}
              />

              {/* Submit button */}
              <div style={{ display : "flex", justifyContent : "flex-end"}}>
                <RaisedButton disabled={this.state.isLoading} type="submit" label="Submit" primary={true}/>
              </div>

            </div>

          </form>
        </CardText>
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