import { ExchangeThree as ExchangeIcon } from '@icon-park/react';
import { OceanOrder, useCancelOceanOrderMutation } from 'graphqlTypes';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Loading, Modal } from 'zarm';

export default function OrderCardComponent(props: {
  order: Partial<OceanOrder> | any;
  linkToMarket?: boolean;
}) {
  const { order, linkToMarket } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const [cancelOceanOrder] = useCancelOceanOrderMutation({
    update() {
      Loading.hide();
    },
  });

  return (
    <div className='px-4 py-1 border-b border-gray-50 dark:border-gray-900'>
      <div
        className='flex items-center cursor-pointer space-x-1'
        onClick={(event) => {
          event.stopPropagation();
          if (linkToMarket) {
            history.push(`/markets/${order.marketId}`);
          }
        }}
      >
        <img className='w-6 h-6 rounded-full' src={order.baseAsset.iconUrl} />
        <div className='text-lg'>{`${order.baseAsset.symbol}/${order.quoteAsset.symbol}`}</div>
        {linkToMarket && <ExchangeIcon size='1rem' className='text-blue-500' />}
      </div>
      <div className='flex items-center'>
        <div
          className={`flex-1 ${
            order.side === 'ask' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          <div className='flex items-baseline'>
            <div className='mr-2 text-lg'>
              {order.side === 'ask' ? t('sell') : t('buy')}
            </div>
            <div className='text-sm text-gray-500'>
              {moment(order.createdAt).format('YY/MM/DD HH:mm')}
            </div>
          </div>
        </div>
        <div className='flex-1 text-sm text-right'>
          {order.state === 'booking' ? (
            <a
              className='block text-blue-500'
              onClick={(event) => {
                event.stopPropagation();
                Modal.confirm({
                  content: t('confirm_cancel_ocean_order'),
                  onOk: () => {
                    cancelOceanOrder({
                      variables: { input: { id: order.id } },
                    });
                    Loading.show({});
                  },
                });
              }}
            >
              {t('cancel_order')}
            </a>
          ) : (
            <span className='text-gray-500'>
              {t(`activerecord.attributes.ocean_order.state/${order.state}`)}
            </span>
          )}
        </div>
      </div>
      <div className='flex items-center'>
        <div className='flex-1'>
          <div className='text-sm text-gray-500'>
            {t('price')}({order.quoteAsset.symbol})
          </div>
          <div>
            {order.orderType === 'limit' ? order.price : t('market_order')}
          </div>
        </div>
        <div className='flex-1 text-center'>
          <div className='text-sm text-gray-500'>
            {t('volume')}(
            {order.side === 'ask'
              ? order.baseAsset.symbol
              : order.quoteAsset.symbol}
            )
          </div>
          <div>
            {order.side === 'ask' ? `${order.amount}` : `${order.funds}`}
          </div>
        </div>
        <div className='flex-1 text-right'>
          <div className='text-sm text-gray-500'>
            {t('filled')}(
            {order.side === 'ask'
              ? order.baseAsset.symbol
              : order.quoteAsset.symbol}
            )
          </div>
          <div>
            {order.side === 'ask'
              ? `${order.filledAmount}`
              : `${order.filledFunds}`}
          </div>
        </div>
      </div>
    </div>
  );
}
