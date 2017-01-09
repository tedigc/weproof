import React from 'react';
import { Route, IndexRoute } from 'react-router';
import LandingPage from '../../components/landingpage/LandingPage';
import SignupPage  from '../../components/landingpage/signup/SignupPage';
import LoginPage   from '../../components/landingpage/login/LoginPage';
import Greetings   from '../../components/Greetings';

export default (
  <Route path="/" component={LandingPage}>
    <IndexRoute component={Greetings}/>
    <Route path="signup" component={SignupPage}/>
    <Route path="login"  component={LoginPage}/>
  </Route>
);