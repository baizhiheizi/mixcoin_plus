import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import {
  useCurrentConversation,
  useCurrentUser,
} from 'apps/application/contexts';
import { useMarketConnectionQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { ActivityIndicator } from 'zarm';

export default function MarketsComponent(props: {
  type: string;
  query?: string;
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const { type, query } = props;
  const { currentUser } = useCurrentUser();
  const { currentConversation } = useCurrentConversation();
  const { loading, data, refetch, fetchMore } = useMarketConnectionQuery({
    variables: { type, query },
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full py-4'>
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
                <div className='text-xs text-gray-500'>
                  /{market.quoteAsset.symbol}
                </div>
              </div>
              <div className='text-xs text-gray-500'>
                24HVol {market.vol24h}
              </div>
            </div>
            <div className='flex-1 text-right'>
              <div className='text-sm text-tray-300'>
                {market.priceCurrent || '-'}
              </div>
              {market.quoteAsset.priceUsd && market.priceCurrent && (
                <div className='text-xs text-gray-500'>
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
                } text-white rounded ml-auto py-1 text-center text-xs w-16`}
              >
                {market.change24h > 0 && '+'}
                {(market.change24h * 100)?.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </PullComponent>
      {type === 'recommended' &&
        currentConversation?.category === 'GROUP' &&
        currentConversation.adminUuids.includes(currentUser?.mixinUuid) && (
          <div className='text-sm text-center text-blue-500'>
            <Link to='/group_markets'>{t('edit_group_markets')}</Link>
          </div>
        )}
    </>
  );
}
