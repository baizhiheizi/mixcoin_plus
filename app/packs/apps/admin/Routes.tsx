import { Button, Result } from 'antd';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage/OverivewPage';
import OceanOrdersPage from './pages/OceanOrdersPage/OceanOrdersPage';
import OceanOrderPage from './pages/OceanOrderPage/OceanOrderPage';

export default function Routes() {
  return (
    <Switch>
      <Route path='/' exact>
        <OverviewPage />
      </Route>
      <Route path='/ocean_orders' exact>
        <OceanOrdersPage />
      </Route>
      <Route path='/ocean_orders/:id' exact>
        <OceanOrderPage />
      </Route>
      <Route>
        <Result
          status='404'
          title='404'
          subTitle='Sorry, the page you visited does not exist.'
          extra={
            <Link to='/'>
              <Button type='primary'>Back Home</Button>
            </Link>
          }
        />
      </Route>
    </Switch>
  );
}
