import { ITick } from 'apps/application/utils';
import BigNumber from 'bignumber.js';
import { Market } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
  },
});

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
  const parseNumber = (str: string) => {
    const number = new BigNumber(str);
    if (number.isLessThan(1)) {
      return number.toFixed(8);
    } else if (number.isLessThan(10)) {
      return number.toFixed(6);
    } else if (number.isLessThan(100)) {
      return number.toFixed(4);
    } else if (number.isLessThan(10000)) {
      return number.toFixed(2);
    } else {
      return number.toFixed(0);
    }
  };

  return (
    <div className='w-full px-4 py-2 min-h-72 grid gap-4 grid-cols-2'>
      <div className='text-sm'>
        <div className='flex items-center justify-between mb-1'>
          <div>{t('buy_volume')}</div>
          <div>{t('buy_price')}</div>
        </div>
        {book.asks.length > 0 ? (
          book.asks
            .slice(0, 20)
            .reverse()
            .map((ask, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='text-gray-700'>{parseNumber(ask.amount)}</div>
                <div className='text-green-500'>{parseNumber(ask.price)}</div>
              </div>
            ))
        ) : connected ? (
          <div className='text-center text-green-500'>{t('no_ask_order')}</div>
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
        {book.bids.length > 0 ? (
          book.bids.slice(0, 20).map((bid, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='text-red-500'>{parseNumber(bid.price)}</div>
              <div className='text-gray-700'>{parseNumber(bid.amount)}</div>
            </div>
          ))
        ) : connected ? (
          <div className='text-center text-red-500'>{t('no_bid_order')}</div>
        ) : (
          <div className='flex p-4'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
    </div>
  );
}
