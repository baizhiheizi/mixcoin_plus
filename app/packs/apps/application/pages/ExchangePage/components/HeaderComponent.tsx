import { MenuFoldOne as MenuIcon, Star as StarIcon } from '@icon-park/react';
import { useDebounce } from 'ahooks';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { ITrade } from 'apps/application/utils';
import { Market, useMarketConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ActivityIndicator, Popup, SearchBar, Tabs } from 'zarm';

export default function HeaderComponent(props: {
  market: Partial<Market> & any;
  setMarketId: (id: string) => any;
  ticker?: ITrade;
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const { market, setMarketId, ticker } = props;
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      <div className='sticky z-10 flex items-start px-4 py-2 mb-1 bg-white shadow-sm top-10 dark:bg-dark dark:text-white'>
        <div className='flex items-center'>
          <MenuIcon
            className='mr-2'
            size='1.5rem'
            onClick={() => setSidebarVisible(!sidebarVisible)}
          />
          <div className='flex items-center mr-2'>
            <div className='relative mr-2'>
              <img
                className='w-6 h-6 rounded-full'
                src={market.baseAsset.iconUrl}
              />
              {market.baseAsset.chainAsset && (
                <img
                  className='absolute bottom-0 left-0 w-3 h-3 border border-white rounded-full'
                  src={market.baseAsset.chainAsset.iconUrl.replace(
                    /s128/,
                    's32',
                  )}
                />
              )}
            </div>
            <div className='text-lg font-semibold'>
              {market.baseAsset.symbol}/{market.quoteAsset.symbol}
            </div>
          </div>
        </div>
        <div className='ml-auto text-right'>
          <div
            className={`${
              ticker?.side === 'ASK' ? 'text-red-500' : 'text-green-500'
            } font-bold text-xl`}
          >
            {ticker?.price || '-'}
          </div>
          {ticker?.price && (
            <div className='text-xs text-gray-500'>
              {`≈ $${(
                market.quoteAsset.priceUsd * parseFloat(ticker.price) || 0
              ).toFixed(2)}`}
            </div>
          )}
          {market.referencePrice > 0 && (
            <div className='text-xs text-gray-300'>
              ({t('reference_price')}:{market.referencePrice})
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
  const quotes = ['favorite', 'USDT', 'pUSD', 'BTC', 'XIN'];
  const [tabIndex, setTabIndex] = useState(0);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, { wait: 500 });
  const { loading, data, refetch, fetchMore } = useMarketConnectionQuery({
    variables: { type: quotes[tabIndex], query: debouncedQuery },
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-white w-72 dark:bg-dark'>
        <ActivityIndicator type='spinner' size='lg' />
      </div>
    );
  }

  const {
    marketConnection: {
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
      <div className='h-screen pt-12 overflow-auto bg-white w-72 dark:bg-dark'>
        <Tabs
          className='fixed top-0 z-10 w-full bg-white dark:bg-dark'
          value={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <Tabs.Panel
            title={
              <StarIcon
                className='flex items-center justify-center h-full'
                size='1.25rem'
                theme='filled'
                fill='#F59E0B'
              />
            }
          ></Tabs.Panel>
          <Tabs.Panel title='USDT'></Tabs.Panel>
          <Tabs.Panel title='pUSD'></Tabs.Panel>
          <Tabs.Panel title='BTC'></Tabs.Panel>
          <Tabs.Panel title='XIN'></Tabs.Panel>
        </Tabs>
        <SearchBar
          value={query}
          onChange={(value: string) => setQuery(value)}
          onClear={() => setQuery('')}
          onCancel={() => setQuery('')}
        />
        <MarketsList />
      </div>
    </>
  );
}
