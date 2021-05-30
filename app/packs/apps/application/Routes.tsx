import {
  useCreateInvitationMutation,
  useCurrentConversationQuery,
  useSwitchLocaleMutation,
} from 'graphqlTypes';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoad from 'react-lazyload';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ActivityIndicator } from 'zarm';
import LoaderComponent from './components/LoaderComponent/LoaderComponent';
import { CurrentConversationContext, useCurrentUser } from './contexts';
import CommissionPage from './pages/CommissionPage/CommissionPage';
import ExchangePage from './pages/ExchangePage/ExchangePage';
import HomePage from './pages/HomePage/HomePage';
import MarketsPage from './pages/MarketsPage/MarketsPage';
import WalletPage from './pages/WalletPage/WalletPage';
const MarketPage = React.lazy(() => import('./pages/MarketPage/MarketPage'));
const GroupMarketsPage = React.lazy(
  () => import('./pages/GroupMarketsPage/GroupMarketsPage'),
);
const SnapshotsPage = React.lazy(
  () => import('./pages/SnapshotsPage/SnapshotsPage'),
);
const OrdersPage = React.lazy(() => import('./pages/OrdersPage/OrdersPage'));
const OrderPage = React.lazy(() => import('./pages/OrderPage/OrderPage'));
const DeprecatedOrdersPage = React.lazy(
  () => import('./pages/DeprecatedOrdersPage/DeprecatedOrdersPage'),
);

export default function Routes() {
  const { currentUser } = useCurrentUser();
  const [switchLocale] = useSwitchLocaleMutation();
  const { i18n } = useTranslation();
  const [createInvitation] = useCreateInvitationMutation({
    update: () => {
      localStorage.setItem('_mixcoinInviteCode', '');
    },
  });
  const { loading, data } = useCurrentConversationQuery();

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (currentUser.locale !== i18n.language) {
      switchLocale({ variables: { input: { locale: i18n.language } } });
    }
    i18n.on('languageChanged', (lng: string) => {
      switchLocale({ variables: { input: { locale: lng } } });
    });
  }, []);

  useEffect(() => {
    const inviteCode = localStorage.getItem('_mixcoinInviteCode');
    if (currentUser?.mayInvited && inviteCode) {
      createInvitation({ variables: { input: { inviteCode } } });
    }
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full py-4'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }
  const { currentConversation } = data;

  return (
    <CurrentConversationContext.Provider value={{ currentConversation }}>
      <Router>
        <Suspense fallback={<LoaderComponent />}>
          <Switch>
            <Route path='/' exact>
              <LazyLoad>
                <HomePage />
              </LazyLoad>
            </Route>
            <Route path='/markets' exact>
              <LazyLoad>
                <MarketsPage />
              </LazyLoad>
            </Route>
            <Route path='/group_markets' exact>
              <LazyLoad>
                <GroupMarketsPage />
              </LazyLoad>
            </Route>
            <Route path='/exchange' exact>
              <LazyLoad>
                <ExchangePage />
              </LazyLoad>
            </Route>
            <Route path='/wallet' exact>
              <LazyLoad>
                <WalletPage />
              </LazyLoad>
            </Route>
            <Route path='/markets/:marketId' exact>
              <LazyLoad>
                <MarketPage />
              </LazyLoad>
            </Route>
            <Route path='/orders' exact>
              <LazyLoad>
                <OrdersPage />
              </LazyLoad>
            </Route>
            <Route path='/orders/:orderId' exact>
              <LazyLoad>
                <OrderPage />
              </LazyLoad>
            </Route>
            <Route path='/snapshots/:assetId' exact>
              <LazyLoad>
                <SnapshotsPage />
              </LazyLoad>
            </Route>
            <Route path='/deprecated_orders' exact>
              <LazyLoad>
                <DeprecatedOrdersPage />
              </LazyLoad>
            </Route>
            <Route path='/commission' exact>
              <LazyLoad>
                <CommissionPage />
              </LazyLoad>
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </CurrentConversationContext.Provider>
  );
}
