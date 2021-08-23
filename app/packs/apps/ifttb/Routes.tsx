import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  useCurrentConversationQuery,
  useSwitchLocaleMutation,
} from 'graphqlTypes';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoad from 'react-lazyload';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ActivityIndicator } from 'zarm';
import { CurrentConversationContext, useCurrentUser } from './contexts';
import AppletsPage from './pages/AppletsPage/AppletsPage';
const NewAppletPage = React.lazy(
  () => import('./pages/NewAppletPage/NewAppletPage'),
);
const NewTriggerPage = React.lazy(
  () => import('./pages/NewTriggerPage/NewTriggerPage'),
);
const NewActionPage = React.lazy(
  () => import('./pages/NewActionPage/NewActionPage'),
);

export default function Routes() {
  const { currentUser } = useCurrentUser();
  const [switchLocale] = useSwitchLocaleMutation();
  const { i18n } = useTranslation();
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
      <Router basename='/ifttb'>
        <Suspense fallback={<LoaderComponent />}>
          <Switch>
            <Route path='/' exact>
              <AppletsPage />
            </Route>
            <Route path='/new' exact>
              <LazyLoad>
                <NewAppletPage />
              </LazyLoad>
            </Route>
            <Route path='/triggers/new/:type' exact>
              <LazyLoad>
                <NewTriggerPage />
              </LazyLoad>
            </Route>
            <Route path='/actions/new/:type' exact>
              <LazyLoad>
                <NewActionPage />
              </LazyLoad>
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </CurrentConversationContext.Provider>
  );
}
