import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useOceanMarketConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ActivityIndicator, Tabs } from 'zarm';

export default function HomeComponent() {
  const tabs = ['favourite', 'pUSD', 'BTC', 'XIN', 'USDT'];
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  return (
    <>
      <Tabs value={tabIndex} onChange={(index) => setTabIndex(index)}>
        <Tabs.Panel title={t('favourite')}></Tabs.Panel>
        <Tabs.Panel title='pUSD'></Tabs.Panel>
        <Tabs.Panel title='BTC'></Tabs.Panel>
        <Tabs.Panel title='XIN'></Tabs.Panel>
        <Tabs.Panel title='USDT'></Tabs.Panel>
      </Tabs>
      <div className='pb-16'>
        <MarketComponent type={tabs[tabIndex]} />
      </div>
    </>
  );
}

function MarketComponent(props: { type: string }) {
  const history = useHistory();
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
  );
}
