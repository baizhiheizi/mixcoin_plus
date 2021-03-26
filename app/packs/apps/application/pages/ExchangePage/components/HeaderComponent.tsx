import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useMixinBot } from 'apps/shared';
import { OceanMarket, useOceanMarketConnectionQuery } from 'graphqlTypes';
import { shareMixinAppCard } from 'mixin-messenger-utils';
import React, { useState } from 'react';
import { Menu as MenuIcon, Share2 as Share2Icon } from 'react-feather';
import { useHistory } from 'react-router';
import { ActivityIndicator, Popup, Tabs } from 'zarm';

export default function HeaderComponent(props: {
  market: Partial<OceanMarket> & any;
  setMarketId: (id: string) => any;
}) {
  const history = useHistory();
  const { market, setMarketId } = props;
  const { appId, appName } = useMixinBot();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      <div className='flex items-center px-4 py-2 mb-1 bg-white dark:bg-gray-800 dark:text-white'>
        <MenuIcon
          className='mr-2 w-7 h-7'
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
        <div className='mr-2 text-lg font-semibold'>
          {market.baseAsset.symbol}/{market.quoteAsset.symbol}
        </div>
        <Share2Icon
          className='h-5 text-blue-500'
          onClick={() =>
            shareMixinAppCard({
              data: {
                action: location.href,
                app_id: appId,
                description: appName,
                icon_url: market.baseAsset.iconUrl,
                title: `${market.baseAsset.symbol}/${market.quoteAsset.symbol}`,
              },
            })
          }
        />
        <div className='ml-auto text-right'>
          {market.baseAsset.changeUsd && (
            <div
              className={`${
                market.baseAsset.changeUsd > 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {(market.baseAsset.changeUsd * 100)?.toFixed(2)}%
            </div>
          )}
          {market.baseAsset.priceUsd && (
            <div className='text-xs text-gray-300'>
              ≈ ${market.baseAsset.priceUsd?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      <Popup
        direction='left'
        onMaskClick={() => setSidebarVisible(false)}
        visible={sidebarVisible}
      >
        <MarketsComponent
          setMarketId={(id) => {
            setMarketId(id);
            history.replace({
              ...history.location,
              search: `?marketId=${id}`,
            });
          }}
          setSidebarVisible={setSidebarVisible}
        />
      </Popup>
    </>
  );
}

function MarketsComponent(props: {
  setMarketId: (id: string) => any;
  setSidebarVisible: (params: any) => any;
}) {
  const { setMarketId, setSidebarVisible } = props;
  const quotes = ['pUSD', 'BTC', 'XIN', 'USDT'];
  const [tabIndex, setTabIndex] = useState(0);
  const { loading, data, refetch, fetchMore } = useOceanMarketConnectionQuery({
    variables: { type: quotes[tabIndex] },
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center w-64 h-screen bg-white'>
        <ActivityIndicator type='spinner' size='lg' />
      </div>
    );
  }

  const {
    oceanMarketConnection: {
      nodes: markets,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const MarketsList = () => (
    <PullComponent
      hasNextPage={hasNextPage}
      refetch={refetch}
      fetchMore={() => fetchMore({ variables: { after: endCursor } })}
    >
      {markets.map((market: any) => (
        <div
          key={market.marketId}
          className='flex items-center justify-center py-2 space-x-1'
          onClick={() => {
            setMarketId(market.id);
            localStorage.setItem('_cachedMarketId', market.id);
            setSidebarVisible(false);
          }}
        >
          <div className='text-xl font-medium'>{market.baseAsset.symbol}</div>
          <div className='text-sm text-gray-500 leading-7'>
            /{market.quoteAsset.symbol}
          </div>
        </div>
      ))}
    </PullComponent>
  );

  return (
    <>
      <div className='w-64 h-screen pt-12 overflow-auto bg-white'>
        <Tabs
          className='fixed top-0 z-10 w-full bg-white'
          value={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <Tabs.Panel title='pUSD'></Tabs.Panel>
          <Tabs.Panel title='BTC'></Tabs.Panel>
          <Tabs.Panel title='XIN'></Tabs.Panel>
          <Tabs.Panel title='USDT'></Tabs.Panel>
        </Tabs>
        <MarketsList />
      </div>
    </>
  );
}
