import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField  from 'material-ui/TextField';
import { Card, CardTitle, CardText, CardActions, CardHeader } from 'material-ui/Card';
import validateInput from '../../../server/shared/validations/signup';

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
    })
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
      <Card style={{width: 500}}>
      <div style={{margin: 20}}>
        <CardTitle title="Sign up" />
        <CardText>

          <form onSubmit={this.onSubmit} style={{display: 'flex', flexDirection: 'column'}}>
          
            {/* Username */}
            <TextField 
              value={this.state.username} 
              onChange={this.onChange} 
              name="username"  
              hintText="Username"
              type="text"
              errorText={this.state.errors.username}
            />

            {/* E-mail */}
            <TextField 
              value={this.state.email} 
              onChange={this.onChange} 
              name="email"  
              hintText="E-mail"
              type="email" 
              errorText={this.state.errors.email}
            />

            {/* Password */}
            <TextField 
              value={this.state.password} 
              onChange={this.onChange} 
              name="password"  
              hintText="Password"
              type="password"
              errorText={this.state.errors.password}
            />

            {/* Confirm Password */}
            <TextField 
              value={this.state.passwordConfirm} 
              onChange={this.onChange} 
              name="passwordConfirm"  
              hintText="Confirm Password"
              type="password" 
              errorText={this.state.errors.passwordConfirm}
            />

            {/* Submit button */}
            <div style={{ display : "flex", justifyContent : "flex-end"}}>
              <RaisedButton disabled={this.state.isLoading} type="submit" label="Submit" primary={true}/>
            </div>

          </form>

        </CardText>
      </div>
      </Card>

    );
  }
}

SignupForm.propTypes = {
  userSignupRequest : React.PropTypes.func.isRequired
}

SignupForm.contextTypes = {
  router : React.PropTypes.object.isRequired
}

export default SignupForm;
