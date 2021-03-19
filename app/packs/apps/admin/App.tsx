import { ApolloProvider } from '@apollo/client';
import { apolloClient } from 'apps/admin/utils';
import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Menus from './Menus';
import LoginPage from './pages/LoginPage/LoginPage';
import Routes from './Routes';
import { CurrentAdminContext, MixinBotContext } from './contexts';

export default function App(props: {
  currentAdmin?: { name: String };
  mixinBot: { appId: String };
}) {
  const { currentAdmin, mixinBot } = props;
  return (
    <ApolloProvider client={apolloClient('/graphql')}>
      {currentAdmin ? (
        <MixinBotContext.Provider value={mixinBot}>
          <CurrentAdminContext.Provider value={currentAdmin}>
            <Router basename='/admin'>
              <Layout className='min-h-screen'>
                <Layout.Sider collapsible>
                  <Menus />
                </Layout.Sider>
                <Layout.Content className='px-4 bg-white'>
                  <Routes />
                </Layout.Content>
              </Layout>
            </Router>
          </CurrentAdminContext.Provider>
        </MixinBotContext.Provider>
      ) : (
        <LoginPage />
      )}
    </ApolloProvider>
  );
}
