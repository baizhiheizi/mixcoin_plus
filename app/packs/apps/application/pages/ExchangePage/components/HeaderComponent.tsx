import {
  Change as ChangeIcon,
  MenuFoldOne as MenuIcon,
} from '@icon-park/react';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { ERC20_USDT_ASSET_ID, OMNI_USDT_ASSET_ID } from 'apps/shared';
import {
  Market,
  useMarketConnectionQuery,
  useMarketLazyQuery,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ActivityIndicator, Loading, Popup, Tabs } from 'zarm';

export default function HeaderComponent(props: {
  market: Partial<Market> & any;
  setMarketId: (id: string) => any;
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { market, setMarketId } = props;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [marketQuery, { called, data }] = useMarketLazyQuery();

  if (called && data?.market) {
    location.replace(`/exchange?market=${data.market.id}`);
  }

  return (
    <>
      <div className='flex items-center px-4 py-2 mb-1 bg-white dark:bg-dark dark:text-white'>
        <MenuIcon
          className='mr-2'
          size='1.5rem'
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
        <div className='mr-2 text-lg font-semibold'>
          {market.baseAsset.symbol}/{market.quoteAsset.symbol}
        </div>
        {market.quoteAsset.symbol === 'USDT' && (
          <div
            className='mr-4'
            onClick={() => {
              Loading.show();
              marketQuery({
                variables: {
                  baseAssetId: market.baseAsset.assetId,
                  quoteAssetId:
                    market.quoteAsset.assetId === ERC20_USDT_ASSET_ID
                      ? OMNI_USDT_ASSET_ID
                      : ERC20_USDT_ASSET_ID,
                },
              });
            }}
          >
            <div className='flex items-center text-xs h-7'>
              <div className='mr-1'>
                {market.quoteAsset.assetId === ERC20_USDT_ASSET_ID
                  ? 'ERC20'
                  : 'Omni'}
              </div>
              <ChangeIcon size='0.75rem' />
            </div>
          </div>
        )}
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
  const { loading, data, refetch, fetchMore } = useMarketConnectionQuery({
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
