import { Change as ChangeIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/application/contexts';
import { ERC20_USDT_ASSET_ID, OMNI_USDT_ASSET_ID } from 'apps/shared';
import { Market, useMarketLazyQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Loading } from 'zarm';

export default function HeaderComponent(props: {
  market: Partial<Market> | any;
}) {
  const history = useHistory();
  const { market } = props;
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const [marketQuery, { called, data }] = useMarketLazyQuery();

  if (called && data?.market) {
    location.replace(`/markets/${data.market.id}`);
  }

  return (
    <>
      <div className='flex items-center px-4 py-2 mb-1 bg-white dark:bg-dark dark:text-white'>
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
    </>
  );
}
