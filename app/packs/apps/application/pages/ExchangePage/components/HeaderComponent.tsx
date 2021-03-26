import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { useMixinBot } from 'apps/shared';
import {
  OceanMarket,
  useFavoriteOceanMarketMutation,
  useOceanMarketConnectionQuery,
  useUnfavoriteOceanMarketMutation,
} from 'graphqlTypes';
import { shareMixinAppCard } from 'mixin-messenger-utils';
import React, { useState } from 'react';
import {
  Menu as MenuIcon,
  Share2 as Share2Icon,
  Star as StarIcon,
} from 'react-feather';
import { useHistory } from 'react-router';
import { ActivityIndicator, Modal, Popup, Tabs } from 'zarm';

export default function HeaderComponent(props: {
  market: Partial<OceanMarket> & any;
  setMarketId: (id: string) => any;
}) {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { market, setMarketId } = props;
  const { appId, appName } = useMixinBot();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [favorite] = useFavoriteOceanMarketMutation({
    variables: { input: { oceanMarketId: market.id } },
  });
  const [unfavorite] = useUnfavoriteOceanMarketMutation({
    variables: { input: { oceanMarketId: market.id } },
  });

  return (
    <>
      <div className='flex items-center px-4 py-2 mb-1 bg-white dark:bg-dark dark:text-white'>
        <MenuIcon
          className='mr-2 w-7 h-7'
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
        <div className='mr-2 text-lg font-semibold'>
          {market.baseAsset.symbol}/{market.quoteAsset.symbol}
        </div>
        <StarIcon
          className={`h-5 mr-4 ${
            market.favorited ? 'text-yellow-500' : 'text-gray-500'
          }`}
          onClick={() => {
            if (!currentUser) {
              Modal.confirm({
                content: t('connect_wallet'),
                onOk: () => location.replace('/'),
              });
            } else if (market.favorited) {
              Modal.confirm({
                content: t('confirm_unfavorite_market'),
                onOk: () => unfavorite(),
              });
            } else {
              favorite();
            }
          }}
        />
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
      <div className='flex items-center justify-center w-64 h-screen bg-white dark:bg-dark'>
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
          <div className='text-xl font-medium dark:text-white'>
            {market.baseAsset.symbol}
          </div>
          <div className='text-sm text-gray-500 leading-7'>
            /{market.quoteAsset.symbol}
          </div>
        </div>
      ))}
    </PullComponent>
  );

  return (
    <>
      <div className='w-64 h-screen pt-12 overflow-auto bg-white dark:bg-dark'>
        <Tabs
          className='fixed top-0 z-10 w-full bg-white dark:bg-dark'
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
