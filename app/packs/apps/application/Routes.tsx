import {
  useCreateInvitationMutation,
  useSwitchLocaleMutation,
} from 'graphqlTypes';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoaderComponent from './components/LoaderComponent/LoaderComponent';
import { useCurrentUser } from './contexts';
import CommissionPage from './pages/CommissionPage/CommissionPage';
import ExchangePage from './pages/ExchangePage/ExchangePage';
import HomePage from './pages/HomePage/HomePage';
import WalletPage from './pages/WalletPage/WalletPage';
const MarketPage = React.lazy(() => import('./pages/MarketPage/MarketPage'));
const SnapshotsPage = React.lazy(
  () => import('./pages/SnapshotsPage/SnapshotsPage'),
);
const OrdersPage = React.lazy(() => import('./pages/OrdersPage/OrdersPage'));
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

  return (
    <Router>
      <Suspense fallback={<LoaderComponent />}>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Route path='/exchange' exact>
            <ExchangePage />
          </Route>
          <Route path='/wallet' exact>
            <WalletPage />
          </Route>
          <Route path='/markets/:marketId' exact>
            <MarketPage />
          </Route>
          <Route path='/orders' exact>
            <OrdersPage />
          </Route>
          <Route path='/snapshots/:assetId' exact>
            <SnapshotsPage />
          </Route>
          <Route path='/deprecated_orders' exact>
            <DeprecatedOrdersPage />
          </Route>
          <Route path='/commission' exact>
            <CommissionPage />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}
