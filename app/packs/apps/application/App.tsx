import { ApolloProvider } from '@apollo/client';
import { FennecContext, MixinBotContext, MixinContext } from 'apps/shared';
import 'apps/shared/locales/i18n';
import { User } from 'graphqlTypes';
import { mixinContext, reloadTheme } from 'mixin-messenger-utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider as ZarmConfigProvider, Toast } from 'zarm';
import enUS from 'zarm/lib/config-provider/locale/en_US';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import Routes from './Routes';
import { apolloClient } from './utils';

export default function App(props: {
  currentUser?: Partial<User>;
  mixinBot: { appId: string; appName: string; appIconUrl: string };
}) {
  const { i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [fennec, setFennec] = useState();
  const { mixinBot } = props;
  const theme =
    mixinContext.appearance ||
    (window.matchMedia('(prefers-color-scheme: dark)')?.matches
      ? 'dark'
      : 'light');

  const inviteCodeParam = new URLSearchParams(window.location.search).get(
    'invite_code',
  );

  if (!currentUser && inviteCodeParam) {
    localStorage.setItem('_mixcoinInviteCode', inviteCodeParam || '');
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.querySelector('html').classList.add('dark');
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute('content', '#1b1c1e');
      reloadTheme();
    } else {
      document.querySelector('html').classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if ((window as any)?.__MIXIN__?.mixin_ext && !fennec) {
      const ext = (window as any).__MIXIN__.mixin_ext;
      ext.enable('Mixcoin').then((ctx: any) => setFennec(ctx));
    }
  }, [fennec]);

  return (
    <>
      <MixinContext.Provider value={mixinContext}>
        <FennecContext.Provider
          value={{
            fennec,
            setFennec,
          }}
        >
          <MixinBotContext.Provider value={mixinBot}>
            <CurrentUserContext.Provider
              value={{ currentUser, setCurrentUser }}
            >
              <ZarmConfigProvider
                theme={theme}
                locale={i18n.language.includes('en') ? enUS : zhCN}
                primaryColor='#1890ff'
              >
                <ApolloProvider
                  client={apolloClient('/graphql', mixinContext.conversationId)}
                >
                  <div className='min-h-screen mx-auto bg-gray-100 max-w-screen-md dark:bg-black dark:text-gray-50'>
                    <Routes />
                  </div>
                </ApolloProvider>
              </ZarmConfigProvider>
            </CurrentUserContext.Provider>
          </MixinBotContext.Provider>
        </FennecContext.Provider>
      </MixinContext.Provider>
    </>
  );
}
