import { Button, Result } from 'antd';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import AppletActivitiesPage from './pages/AppletActivitiesPage/AppletActivitiesPage';
import AppletPage from './pages/AppletPage/AppletPage';
import AppletsPage from './pages/AppletsPage/AppletsPage';
import ArbitrageOrderPage from './pages/ArbitrageOrderPage/ArbitrageOrderPage';
import ArbitrageOrdersPage from './pages/ArbitrageOrdersPage/ArbitrageOrdersPage';
import BalancePage from './pages/BalancePage/BalancePage';
import BookingOrderActivitiesPage from './pages/BookingOrderActivitiesPage/BookingOrderActivitiesPage';
import BookingOrderActivityPage from './pages/BookingOrderActivityPage/BookingOrderActivityPage';
import BookingOrderSnapshotsPage from './pages/BookingOrderSnapshotsPage/BookingOrderSnapshotsPage';
import IfttbOrdersPage from './pages/IfttbOrdersPage/IfttbOrdersPage';
import InvitationsPage from './pages/InvitationsPage/InvitationsPage';
import MarketPage from './pages/MarketPage/MarketPage';
import MarketsPage from './pages/MarketsPage/MarketsPage';
import MixinConversationPage from './pages/MixinConversationPage/MixinConversationPage';
import MixinConversationsPage from './pages/MixinConversationsPage/MixinConversationsPage';
import MixinMessagesPage from './pages/MixinMessagesPage/MixinMessagesPage';
import MixinNetworkSnapshotsPage from './pages/MixinNetworkSnapshotsPage/MixinNetworkSnapshotsPage';
import MixinNetworkUserPage from './pages/MixinNetworkUserPage/MixinNetworkUserPage';
import MixinNetworkUsersPage from './pages/MixinNetworkUsersPage/MixinNetworkUsersPage';
import MixinTransfersPage from './pages/MixinTransfersPage/MixinTransfersPage';
import OceanOrderPage from './pages/OceanOrderPage/OceanOrderPage';
import OceanOrdersPage from './pages/OceanOrdersPage/OceanOrdersPage';
import OverviewPage from './pages/OverviewPage/OverivewPage';
import SwapOrderPage from './pages/SwapOrderPage/SwapOrderPage';
import SwapOrdersPage from './pages/SwapOrdersPage/SwapOrdersPage';
import UserPage from './pages/UserPage/UserPage';
import UsersPage from './pages/UsersPage/UsersPage';

export default function Routes() {
  return (
    <Switch>
      <Route path='/' exact>
        <OverviewPage />
      </Route>
      <Route path='/applets' exact>
        <AppletsPage />
      </Route>
      <Route path='/applets/:id' exact>
        <AppletPage />
      </Route>
      <Route path='/applet_activities' exact>
        <AppletActivitiesPage />
      </Route>
      <Route path='/ifttb_orders' exact>
        <IfttbOrdersPage />
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
      <Route path='/swap_orders' exact>
        <SwapOrdersPage />
      </Route>
      <Route path='/swap_orders/:id' exact>
        <SwapOrderPage />
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
      <Route path='/mixin_network_users/:uuid' exact>
        <MixinNetworkUserPage />
      </Route>
      <Route path='/arbitrage_orders' exact>
        <ArbitrageOrdersPage />
      </Route>
      <Route path='/arbitrage_orders/:id' exact>
        <ArbitrageOrderPage />
      </Route>
      <Route path='/booking_order_snapshots' exact>
        <BookingOrderSnapshotsPage />
      </Route>
      <Route path='/booking_order_activities' exact>
        <BookingOrderActivitiesPage />
      </Route>
      <Route path='/booking_order_activities/:id' exact>
        <BookingOrderActivityPage />
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
