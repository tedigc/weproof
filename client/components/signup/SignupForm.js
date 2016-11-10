import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField  from 'material-ui/TextField';
import { Card, CardTitle, CardText, CardActions, CardHeader } from 'material-ui/Card';

class SignupForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'email'           : '',
      'username'        : '',
      'password'        : '',
      'confirmPassword' : ''
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
    console.log('hi');
    this.props.userSignupRequest(this.state);
  }

  render() {
    return (
      <div>
        <div className="row" >
          <div className="col-md-6 col-md-offset-3">

            <Card>
              <CardTitle title="Sign up" />
              <CardText>

                <form onSubmit={this.onSubmit}>
                
                  {/* Username */}
                  <div className="row">
                    <TextField 
                      value={this.state.username} 
                      onChange={this.onChange} 
                      name="username"  
                      hintText="Username"
                      type="text" 
                    />
                  </div>

                  {/* E-mail */}
                  <div className="row">
                    <TextField 
                      value={this.state.email} 
                      onChange={this.onChange} 
                      name="email"  
                      hintText="E-mail"
                      type="email" 
                    />
                  </div>

                  {/* Password */}
                  <div className="row">
                    <TextField 
                      value={this.state.password} 
                      onChange={this.onChange} 
                      name="password"  
                      hintText="Password"
                      type="password" 
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="row">
                    <TextField 
                      value={this.state.confirmPassword} 
                      onChange={this.onChange} 
                      name="confirmPassword"  
                      hintText="Confirm Password"
                      type="password" 
                    />
                  </div>

                  <div className="row">
                    <RaisedButton type="submit" label="Submit" primary={true}/>
                  </div>
                </form>

              </CardText>
            </Card>

          </div>
        </div>        
      </div>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest : React.PropTypes.func.isRequired
}

export default SignupForm;
