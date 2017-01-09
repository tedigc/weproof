import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Dashboard   from '../../components/dashboard/Dashboard';
import Greetings   from '../../components/Greetings';

export default (
  <Route path="/" component={Dashboard}>
    <IndexRoute component={Greetings}/>
  </Route>
);