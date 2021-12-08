import React from 'react';
import { Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import Login from '../pages/Login';
import Photos from '../pages/Photos';
import Register from '../pages/Register';
import Student from '../pages/Student';
import Students from '../pages/Students';
import Page404 from '../pages/Page404';

export default function Routes() {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Students} isClosed={false} />
      <PrivateRoute
        exact
        path="/student/:id/edit"
        component={Student}
        isClosed
      />
      <PrivateRoute exact path="/student/" component={Student} isClosed />
      <PrivateRoute exact path="/photos/:id" component={Photos} isClosed />
      <PrivateRoute exact path="/login/" component={Login} isClosed={false} />
      <PrivateRoute
        exact
        path="/register/"
        component={Register}
        isClosed={false}
      />
      <PrivateRoute path="*" component={Page404} />
    </Switch>
  );
}
