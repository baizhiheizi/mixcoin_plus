import { Market, useMarketTradeConnectionQuery } from 'graphqlTypes';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

export default function HistoryTradesComponent(props: {
  market: Partial<Market>;
}) {
  const { market } = props;
  const { loading, data } = useMarketTradeConnectionQuery({
    variables: { marketId: market.id },
    fetchPolicy: 'network-only',
  });
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className='flex p-4'>
        <ActivityIndicator type='spinner' className='m-auto' />
      </div>
    );
  }

  const {
    marketTradeConnection: { nodes: trades },
  } = data;

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
          <div key={trade.tradedAt} className='flex items-center mb-1'>
            <div className='flex-1 text-left'>{trade.amount}</div>
            <div
              className={`text-center flex-1 ${
                trade.side === 'ask' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {trade.price}
            </div>
            <div className='flex-1 text-xs text-right'>
              {moment(trade.tradedAt).isAfter(moment().startOf('day'))
                ? moment(trade.tradedAt).format('HH:mm:ss')
                : moment(trade.tradedAt).format('YY/MM/DD HH:mm')}
            </div>
          </div>
        ))
      ) : (
        <div className='p-4 text-center text-red-500'>{t('no_trades_yet')}</div>
      )}
    </div>
  );
}
