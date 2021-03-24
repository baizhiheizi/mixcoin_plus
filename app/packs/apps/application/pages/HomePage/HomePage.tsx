import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import TabbarComponent from 'apps/application/components/TabbarComponent/TabbarComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { useOceanMarketConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { User as UserIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ActivityIndicator, Message, Popup, Tabs } from 'zarm';
import MineComponent from './components/MineComponent';

export default function HomePage() {
  const { currentUser } = useCurrentUser();
  const tabs = ['favourite', 'pUSD', 'BTC', 'XIN', 'USDT'];
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const cachedTabIndex = tabs.findIndex(
    (tab) => tab === localStorage.getItem('_cachedQuote'),
  );
  const [tabIndex, setTabIndex] = useState(
    cachedTabIndex > -1 ? cachedTabIndex : currentUser ? 0 : 1,
  );
  const { t } = useTranslation();

  return (
    <>
      <div className='fixed z-10 flex items-center w-full bg-white'>
        {currentUser ? (
          <img
            className='w-6 h-6 mx-2 rounded-full'
            src={currentUser.avatar.replace(/s128$/, 's32')}
            onClick={() => setSidebarVisible(!sidebarVisible)}
          />
        ) : (
          <UserIcon
            className='w-6 h-6 mx-2'
            onClick={() => setSidebarVisible(!sidebarVisible)}
          />
        )}
        <Tabs
          className='flex-1'
          value={tabIndex}
          onChange={(index) => {
            setTabIndex(index);
            localStorage.setItem('_cachedQuote', tabs[index]);
          }}
        >
          <Tabs.Panel title={t('favourite')}></Tabs.Panel>
          <Tabs.Panel title='pUSD'></Tabs.Panel>
          <Tabs.Panel title='BTC'></Tabs.Panel>
          <Tabs.Panel title='XIN'></Tabs.Panel>
          <Tabs.Panel title='USDT'></Tabs.Panel>
        </Tabs>
      </div>
      <div className='pt-12 pb-16'>
        <MarketComponent type={tabs[tabIndex]} />
      </div>
      <Popup
        direction='left'
        onMaskClick={() => setSidebarVisible(false)}
        visible={sidebarVisible}
      >
        <MineComponent />
      </Popup>
    </>
  );
}

function MarketComponent(props: { type: string }) {
  const history = useHistory();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { loading, data, refetch, fetchMore } = useOceanMarketConnectionQuery({
    variables: { type: props.type },
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }

  const {
    oceanMarketConnection: {
      nodes: markets,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;
  return (
    <>
      {!currentUser && (
        <Message size='lg' theme='warning'>
          {t('connect_wallet_to_exhange')}
          <a
            className='mx-1 font-semibold'
            onClick={() => location.replace('/login')}
          >
            {t('connect_wallet')}
          </a>
        </Message>
      )}
      <PullComponent
        refetch={refetch}
        fetchMore={() => fetchMore({ variables: { after: endCursor } })}
        hasNextPage={hasNextPage}
      >
        {markets.map((market) => (
          <div
            onClick={() => history.push(`/exchange?marketId=${market.id}`)}
            key={market.marketId}
            className='flex items-center px-4 py-2'
          >
            <img
              className='w-8 h-8 mr-2 rounded-full'
              src={market.baseAsset.iconUrl.replace(/s128$/, 's32')}
            />
            <div className='flex items-center'>
              <div className='mr-1 text-base font-semibold'>
                {market.baseAsset.symbol}
              </div>
              <div className='text-xs'>/{market.quoteAsset.symbol}</div>
            </div>
          </div>
        ))}
      </PullComponent>
      <TabbarComponent activeTabKey='home' />
    </>
  );
}
