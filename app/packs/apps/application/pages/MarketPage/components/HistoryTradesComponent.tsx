import { ITrade } from 'apps/application/utils';
import { Market } from 'graphqlTypes';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function HistoryTradesComponent(props: {
  fetched: boolean;
  market: Partial<Market>;
  trades: ITrade[];
}) {
  const { market, trades, fetched } = props;
  const { t } = useTranslation();

  return (
    <div className='px-4 py-2 text-sm bg-white min-h-72 dark:bg-dark'>
      <div className='mb-2 grid grid-cols-3'>
        <div className='text-left'>
          {t('volume')}({market.baseAsset.symbol})
        </div>
        <div className='text-center'>
          {t('price')}({market.quoteAsset.symbol})
        </div>
        <div className='text-right'>{t('time')}</div>
      </div>
      {trades.length > 0 ? (
        trades.map((trade) => (
          <div key={trade.created_at} className='flex items-center mb-1'>
            <div className='flex-1 text-left'>{trade.amount}</div>
            <div
              className={`text-center flex-1 ${
                trade.side === 'ASK' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {trade.price}
            </div>
            <div className='flex-1 text-xs text-right'>
              {moment(trade.created_at).isAfter(moment().startOf('day'))
                ? moment(trade.created_at).format('HH:mm:ss')
                : moment(trade.created_at).format('YY/MM/DD HH:mm')}
            </div>
          </div>
        ))
      ) : fetched ? (
        <div className='p-4 text-center text-red-500'>{t('no_trades_yet')}</div>
      ) : (
        <div className='flex p-4'>
          <ActivityIndicator type='spinner' className='m-auto' />
        </div>
      )}
    </div>
  );
}
