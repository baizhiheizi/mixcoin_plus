import { Button, Result } from 'antd';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import BalancePage from './pages/BalancePage/BalancePage';
import MixinMessagesPage from './pages/MixinMessagesPage/MixinMessagesPage';
import MixinNetworkSnapshotsPage from './pages/MixinNetworkSnapshotsPage/MixinNetworkSnapshotsPage';
import OceanMarketsPage from './pages/OceanMarketsPage/OceanMarketsPage';
import OceanOrderPage from './pages/OceanOrderPage/OceanOrderPage';
import OceanOrdersPage from './pages/OceanOrdersPage/OceanOrdersPage';
import OverviewPage from './pages/OverviewPage/OverivewPage';
import UserPage from './pages/UserPage/UserPage';
import UsersPage from './pages/UsersPage/UsersPage';

export default function Routes() {
  return (
    <Switch>
      <Route path='/' exact>
        <OverviewPage />
      </Route>
      <Route path='/ocean_markets' exact>
        <OceanMarketsPage />
      </Route>
      <Route path='/ocean_orders' exact>
        <OceanOrdersPage />
      </Route>
      <Route path='/ocean_orders/:id' exact>
        <OceanOrderPage />
      </Route>
      <Route path='/mixin_network_snapshots' exact>
        <MixinNetworkSnapshotsPage />
      </Route>
      <Route path='/mixin_messages' exact>
        <MixinMessagesPage />
      </Route>
      <Route path='/users' exact>
        <UsersPage />
      </Route>
      <Route path='/users/:id' exact>
        <UserPage />
      </Route>
      <Route path='/balance' exact>
        <BalancePage />
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
