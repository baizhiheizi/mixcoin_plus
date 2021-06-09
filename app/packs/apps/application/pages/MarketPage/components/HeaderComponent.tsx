import { Market } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HeaderComponent(props: {
  market: Partial<Market> | any;
}) {
  const { market } = props;
  const { t } = useTranslation();

  return (
    <>
      <div className='px-4 py-2 mb-1 bg-white dark:bg-dark dark:text-white'>
        <div className='flex items-center'>
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
        <div className='flex items-center'>
          <div className='flex-1'>
            <div
              className={`${
                market.priceCurrent ? 'text-2xl' : 'text-base'
              } font-bold ${
                market.change24h < 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {market.priceCurrent || t('no_trades_yet')}
            </div>
            <div className='flex items-baseline'>
              {market.quoteAsset.priceUsd && market.priceCurrent && (
                <div className='mr-2 text-xs text-gray-300'>
                  ≈ $
                  {(market.quoteAsset.priceUsd * market.priceCurrent)?.toFixed(
                    2,
                  )}
                </div>
              )}
              <div
                className={`${
                  market.change24h < 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {market.change24h > 0 && '+'}
                {(market.change24h * 100)?.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className='flex-1 pl-16 text-xs text-gray-300'>
            <div className='flex items-center'>
              <div className=''>{t('24h_high')}:</div>
              <div className='ml-auto'>{market.highPrice24h || '-'}</div>
            </div>
            <div className='flex items-center'>
              <div className=''>{t('24h_low')}:</div>
              <div className='ml-auto'>{market.lowPrice24h || '-'}</div>
            </div>
            <div className='flex items-center'>
              <div className=''>{t('24h_volumne')}:</div>
              <div className='ml-auto'>{market.vol24h || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
