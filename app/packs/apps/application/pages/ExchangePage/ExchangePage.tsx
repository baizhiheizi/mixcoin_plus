import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useMixinBot } from 'apps/shared';
import {
  OceanMarket,
  useOceanMarketConnectionQuery,
  useOceanMarketQuery,
} from 'graphqlTypes';
import { shareMixinAppCard } from 'mixin-messenger-utils';
import React, { useEffect, useState } from 'react';
import { Menu as MenuIcon, Share2 as Share2Icon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ActivityIndicator, Popup, Tabs } from 'zarm';
import ActionComponent from './components/ActionComponent';
import BookComponent from './components/BookComponent';
import OceanOrdersComponent from './components/OceanOrdersComponent';

export default function ExchangePage() {
  const history = useHistory();
  const marketIdParam = new URLSearchParams(history.location.search).get(
    'marketId',
  );
  const { t } = useTranslation();
  const { appId, appName } = useMixinBot();
  const [marketId, setMarketId] = useState(
    marketIdParam || localStorage.getItem('_cachedMarketId') || '',
  );
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [orderPrice, setOrderPrice] = useState<string>('');
  const [orderAmount, setOrderAmount] = useState<string>('');
  const { loading, data } = useOceanMarketQuery({
    variables: { id: marketId },
  });

  useEffect(() => {
    if (!marketIdParam) {
      history.replace({
        ...history.location,
        search: `?marketId=${marketId}`,
      });
    }
  }, [marketId]);

  if (loading) {
    return <LoaderComponent />;
  }

  const { oceanMarket: market } = data;

  if (!Boolean(market)) {
    return <div className='pt-32 text-center'>:(</div>;
  }

  if (market.id !== marketId) {
    setMarketId(market.id);
  }

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
      <div className='flex items-center p-4 mb-1 bg-white dark:bg-gray-800'>
        <div className='w-3/5 pr-2 h-96'>
          <ActionComponent
            market={market as OceanMarket}
            orderPrice={orderPrice}
            setOrderPrice={setOrderPrice}
            orderAmount={orderAmount}
            setOrderAmount={setOrderAmount}
          />
        </div>
        <div className='w-2/5'>
          <BookComponent
            market={market as OceanMarket}
            setOrderPrice={setOrderPrice}
            setOrderAmount={setOrderAmount}
          />
        </div>
      </div>
      <div className='bg-white dark:bg-gray-800'>
        <OceanOrdersComponent marketId={market.id} />
      </div>
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
            setMarketId(market.marketId);
            localStorage.setItem('_cachedMarketId', market.marketId);
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
    <div className='w-64 h-screen bg-white'>
      <Tabs value={tabIndex} onChange={(index) => setTabIndex(index)}>
        <Tabs.Panel title='pUSD'>
          <MarketsList />
        </Tabs.Panel>
        <Tabs.Panel title='BTC'>
          <MarketsList />
        </Tabs.Panel>
        <Tabs.Panel title='XIN'>
          <MarketsList />
        </Tabs.Panel>
        <Tabs.Panel title='USDT'>
          <MarketsList />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
