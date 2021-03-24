import { useMixin, useMixinBot } from 'apps/shared';
import { useSwitchLocaleMutation } from 'graphqlTypes';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { Icon, NavBar } from 'zarm';
import LoaderComponent from './components/LoaderComponent/LoaderComponent';
import { useCurrentUser } from './contexts';
const HomePage = React.lazy(() => import('./pages/HomePage/HomePage'));
const ExchangePage = React.lazy(
  () => import('./pages/ExchangePage/ExchangePage'),
);
const WalletPage = React.lazy(() => import('./pages/WalletPage/WalletPage'));

export default function Routes() {
  const { currentUser } = useCurrentUser();
  const [switchLocale] = useSwitchLocaleMutation();
  const { i18n } = useTranslation();

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

  return (
    <Router>
      <NavbarComponent />
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
        </Switch>
      </Suspense>
    </Router>
  );
}

function NavbarComponent() {
  const mixinBot = useMixinBot();
  const { immersive } = useMixin();

  if (immersive) {
    return (
      <NavBar
        className='z-10 bg-white dark:bg-gray-900 dark:text-gray-50'
        title={mixinBot.name}
      />
    );
  } else {
    return null;
  }
}
