import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import Dashboard   from './components/dashboard/Dashboard';
import Home        from './components/dashboard/home/Home';
import Work        from './components/dashboard/work/Work';
import Submitted   from './components/dashboard/submitted/Submitted';
import Excerpts    from './components/dashboard/excerpts/Excerpts';
import Settings    from './components/dashboard/settings/Settings';
import LandingPage from './components/landingpage/LandingPage';
import SignupPage  from './components/landingpage/signup/SignupPage';
import LoginPage   from './components/landingpage/login/LoginPage';
import Greetings   from './components/landingpage/Greetings';
import requireAuth from './utils/requireAuth';

export default (
  <Route path="/">
    <Route path="" component={LandingPage}>
      <IndexRoute component={Greetings}/>
      <Route path="signup" component={SignupPage}/>
      <Route path="login"  component={LoginPage}/>
    </Route>
    <Route path="/dashboard" component={requireAuth(Dashboard)}>
      <IndexRedirect to="/dashboard/home" />
      <Route path="home"      component={Home}/>
      <Route path="work"      component={Work}/>
      <Route path="submitted" component={Submitted}/>
      <Route path="excerpts"  component={Excerpts}/>
      <Route path="settings"  component={Settings}/>
    </Route>
  </Route>
);