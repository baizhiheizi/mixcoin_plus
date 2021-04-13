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
            <div className='relative'>
              <img
                className='w-10 h-10 mr-2 rounded-full'
                src={market.baseAsset.iconUrl.replace(/s128$/, 's64')}
              />
              {market.baseAsset.chainAsset && (
                <img
                  className='absolute bottom-0 left-0 w-4 h-4 border border-white rounded-full'
                  src={market.baseAsset.chainAsset.iconUrl.replace(
                    /s128/,
                    's32',
                  )}
                />
              )}
            </div>
            <div className='flex items-baseline'>
              <div className='mr-1 text-lg font-semibold'>
                {market.baseAsset.symbol}
              </div>
              <div className='text-xs'>/{market.quoteAsset.symbol}</div>
            </div>
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
        ))}
      </PullComponent>
    </>
  );
}
