import { ITick, parseBookNumber } from 'apps/application/utils';
import { Market } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function BookComponent(props: {
  market: Partial<Market> & any;
  connected: boolean;
  book: {
    asks: ITick[];
    bids: ITick[];
  };
}) {
  const { t } = useTranslation();
  const { market, book, connected } = props;

  return (
    <div className='w-full px-4 py-2 min-h-72 grid gap-4 grid-cols-2'>
      <div className='text-sm'>
        <div className='flex items-center justify-between mb-1'>
          <div>{t('buy_volume')}</div>
          <div>{t('buy_price')}</div>
        </div>
        {book.bids.length > 0 ? (
          book.bids.slice(0, 20).map((bid, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='text-gray-500 dark:text-gray-100'>
                {parseBookNumber(bid.amount)}
              </div>
              <div className='text-green-500'>{parseBookNumber(bid.price)}</div>
            </div>
          ))
        ) : connected ? (
          <div className='text-center text-green-500'>{t('no_bid_order')}</div>
        ) : (
          <div className='flex p-4'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
      <div className='text-sm'>
        <div className='flex items-center justify-between mb-1'>
          <div>{t('sell_price')}</div>
          <div>{t('sell_volume')}</div>
        </div>
        {book.asks.length > 0 ? (
          book.asks.slice(0, 20).map((ask, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='text-red-500'>{parseBookNumber(ask.price)}</div>
              <div className='text-gray-500 dark:text-gray-100'>
                {parseBookNumber(ask.amount)}
              </div>
            </div>
          ))
        ) : connected ? (
          <div className='text-center text-red-500'>{t('no_ask_order')}</div>
        ) : (
          <div className='flex p-4'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
    </div>
  );
}
