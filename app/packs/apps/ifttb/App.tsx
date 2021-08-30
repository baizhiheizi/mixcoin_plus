import { ApolloProvider } from '@apollo/client';
import { MixinBotContext, MixinContext } from 'apps/shared';
import 'apps/shared/locales/i18n';
import consumer from 'channels/consumer';
import { User } from 'graphqlTypes';
import { mixinContext, reloadTheme } from 'mixin-messenger-utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider as ZarmConfigProvider, Toast } from 'zarm';
import enUS from 'zarm/lib/config-provider/locale/en_US';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import { CurrentUserContext } from './contexts';
import Routes from './Routes';
import { apolloClient } from './utils/apolloClient';

export default function App(props: {
  currentUser?: Partial<User>;
  mixinBot: { appId: string; appName: string; appIconUrl: string };
}) {
  const { i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const { mixinBot } = props;

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute('content', '#1b1c1e');
    reloadTheme();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    consumer.subscriptions.create('Noticed::NotificationChannel', {
      connected() {
        console.log('Action Cable Connected');
      },
      disconnected() {
        console.log('Action Cable disconnected');
      },
      received(data: any) {
        Toast.show(data);
      },
    });
  }, [currentUser]);

  return (
    <>
      <MixinContext.Provider value={mixinContext}>
        <MixinBotContext.Provider value={mixinBot}>
          <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            <ZarmConfigProvider locale={enUS} primaryColor='#1b1c1e'>
              <ApolloProvider
                client={apolloClient('/graphql', mixinContext.conversationId)}
              >
                <div className='min-h-screen mx-auto font-mono bg-white max-w-screen-md'>
                  <Routes />
                </div>
              </ApolloProvider>
            </ZarmConfigProvider>
          </CurrentUserContext.Provider>
        </MixinBotContext.Provider>
      </MixinContext.Provider>
    </>
  );
}
