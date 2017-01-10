import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Dashboard from '../../components/dashboard/Dashboard';
import Home      from '../../components/dashboard/home/Home';
import Work      from '../../components/dashboard/work/Work';
import Submitted from '../../components/dashboard/submitted/Submitted';
import Excerpts  from '../../components/dashboard/excerpts/Excerpts';
import Settings  from '../../components/dashboard/settings/Settings';

export default (
  <Route path="/" component={Dashboard}>
    <IndexRoute component={Home}/>
    <Route path="home"      component={Home}/>
    <Route path="work"      component={Work}/>
    <Route path="submitted" component={Submitted}/>
    <Route path="excerpts"  component={Excerpts}/>
    <Route path="settings"  component={Settings}/>
  </Route>
);