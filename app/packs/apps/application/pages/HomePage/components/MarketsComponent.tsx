import { useDebounce } from 'ahooks';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { useMarketConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ActivityIndicator, Message, SearchBar } from 'zarm';

export function MarketsComponent(props: { type: string }) {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, { wait: 500 });

  return (
    <>
      <SearchBar
        value={query}
        onChange={(value: string) => setQuery(value)}
        onClear={() => setQuery('')}
        onCancel={() => setQuery('')}
      />
      {!currentUser && (
        <Message size='lg' theme='warning'>
          <div>
            <span>{t('connect_wallet_to_exhange')}</span>
            <a
              className='mx-1 font-semibold'
              onClick={() => location.replace('/login')}
            >
              {t('connect_wallet')}
            </a>
          </div>
        </Message>
      )}
      <MarketsListComponent type={props.type} query={debouncedQuery} />
    </>
  );
}

function MarketsListComponent(props: { type: string; query?: string }) {
  const history = useHistory();
  const { t } = useTranslation();
  const { type, query } = props;
  const { loading, data, refetch, fetchMore } = useMarketConnectionQuery({
    variables: { type, query },
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center h-18'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }

  const {
    marketConnection: {
      nodes: markets,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;
  return (
    <>
      <PullComponent
        refetch={refetch}
        fetchMore={() => fetchMore({ variables: { after: endCursor } })}
        hasNextPage={hasNextPage}
        emptyText={t('empty_markets')}
      >
        {markets.map((market) => (
          <div
            onClick={() => history.push(`/markets/${market.id}`)}
            key={market.id}
            className='flex items-center px-4 py-2'
          >
            <div className='flex-1'>
              <div className='flex items-baseline'>
                <div className='text-base font-semibold'>
                  {market.baseAsset.symbol}
                </div>
                <div className='text-xs text-gray-300'>
                  /{market.quoteAsset.symbol}
                </div>
              </div>
              <div className='text-xs text-gray-300'>
                24HVol {market.vol24h}
              </div>
            </div>
            <div className='flex-1 text-right'>
              <div className='text-sm text-tray-300'>
                {market.priceCurrent || '-'}
              </div>
              {market.quoteAsset.priceUsd && market.priceCurrent && (
                <div className='text-xs text-gray-300'>
                  ≈ $
                  {(market.quoteAsset.priceUsd * market.priceCurrent)?.toFixed(
                    2,
                  )}
                </div>
              )}
            </div>
            <div className='flex flex-1'>
              <div
                className={`${
                  market.change24h < 0 ? 'bg-red-500' : 'bg-green-500'
                } text-white rounded ml-auto px-2 text-sm`}
              >
                {market.change24h > 0 && '+'}
                {(market.change24h * 100)?.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </PullComponent>
    </>
  );
}
