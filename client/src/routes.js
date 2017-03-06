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
import Task        from './components/task/Task';
import Error404    from './components/errors/Error404';
import Error403    from './components/errors/Error403';
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
    <Route path="/task" component={requireAuth(Task)}>
      <IndexRedirect to="/dashboard/work" />
      <Route path=":excerptId" component={Task}/>
    </Route>
    <Route path="/403" component={Error403}/>
    <Route path="/404" component={Error404}/>
    <Route path="*"    component={Error404}/>
  </Route>
);