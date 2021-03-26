import { ITrade } from 'apps/application/utils';
import { OceanMarket } from 'graphqlTypes';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function HistoryTradesComponent(props: {
  fetched: boolean;
  market: Partial<OceanMarket>;
  trades: ITrade[];
}) {
  const { market, trades, fetched } = props;
  const { t } = useTranslation();

  return (
    <div className='px-4 py-2 text-sm bg-white min-h-72'>
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
          <div key={trade.created_at} className='mb-1 grid grid-cols-3'>
            <div className='text-left'>{trade.amount}</div>
            <div
              className={`text-center ${
                trade.side === 'ASK' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {trade.price}
            </div>
            <div className='text-right'>
              {moment(trade.created_at).format('YY/MM/DD HH:mm')}
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
