import { Button, Result } from 'antd';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import BalancePage from './pages/BalancePage/BalancePage';
import InvitationsPage from './pages/InvitationsPage/InvitationsPage';
import MarketPage from './pages/MarketPage/MarketPage';
import MarketsPage from './pages/MarketsPage/MarketsPage';
import MixinConversationPage from './pages/MixinConversationPage/MixinConversationPage';
import MixinConversationsPage from './pages/MixinConversationsPage/MixinConversationsPage';
import MixinMessagesPage from './pages/MixinMessagesPage/MixinMessagesPage';
import MixinNetworkSnapshotsPage from './pages/MixinNetworkSnapshotsPage/MixinNetworkSnapshotsPage';
import MixinNetworkUsersPage from './pages/MixinNetworkUsersPage/MixinNetworkUsersPage';
import MixinTransfersPage from './pages/MixinTransfersPage/MixinTransfersPage';
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
      <Route path='/markets' exact>
        <MarketsPage />
      </Route>
      <Route path='/markets/:id' exact>
        <MarketPage />
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
      <Route path='/mixin_transfers' exact>
        <MixinTransfersPage />
      </Route>
      <Route path='/mixin_conversations' exact>
        <MixinConversationsPage />
      </Route>
      <Route path='/mixin_conversations/:id' exact>
        <MixinConversationPage />
      </Route>
      <Route path='/mixin_messages' exact>
        <MixinMessagesPage />
      </Route>
      <Route path='/users' exact>
        <UsersPage />
      </Route>
      <Route path='/mixin_network_users' exact>
        <MixinNetworkUsersPage />
      </Route>
      <Route path='/invitations' exact>
        <InvitationsPage />
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
