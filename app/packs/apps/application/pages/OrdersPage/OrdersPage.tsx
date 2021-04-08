import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import {
  useCancelOceanOrderMutation,
  useOceanOrderConnectionQuery,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading, Modal, Tabs } from 'zarm';
import moment from 'moment';

export default function OrdersPage() {
  const { t } = useTranslation();
  const filters = ['booking', 'history'];
  const [filter, setFilter] = useState('booking');
  const { loading, data, refetch, fetchMore } = useOceanOrderConnectionQuery({
    variables: { filter },
  });
  const [cancelOceanOrder] = useCancelOceanOrderMutation({
    update() {
      Loading.hide();
    },
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const {
    oceanOrderConnection: {
      nodes: orders,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  return (
    <div className='min-h-screen bg-white dark:bg-dark'>
      <NavbarComponent back />
      <Tabs
        value={filters.findIndex((i) => i === filter)}
        onChange={(index) => setFilter(filters[index])}
      >
        <Tabs.Panel title={t('my_open_orders')}></Tabs.Panel>
        <Tabs.Panel title={t('my_order_history')}></Tabs.Panel>
      </Tabs>
      <PullComponent
        hasNextPage={hasNextPage}
        refetch={refetch}
        fetchMore={() => fetchMore({ variables: { after: endCursor } })}
      >
        {orders.map((order: any) => (
          <div
            key={order.traceId}
            className='px-4 py-1 border-b border-gray-50 dark:border-gray-900'
          >
            <div className='mr-2 text-lg'>{`${order.baseAsset.symbol}/${order.quoteAsset.symbol}`}</div>
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
                    onClick={() =>
                      Modal.confirm({
                        content: t('confirm_cancel_ocean_order'),
                        onOk: () => {
                          cancelOceanOrder({
                            variables: { input: { id: order.id } },
                          });
                          Loading.show({});
                        },
                      })
                    }
                  >
                    {t('cancel_order')}
                  </a>
                ) : (
                  <span className='text-gray-500'>
                    {t(
                      `activerecord.attributes.ocean_order.state/${order.state}`,
                    )}
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
                  {order.orderType === 'limit'
                    ? order.price
                    : t('market_order')}
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
        ))}
      </PullComponent>
    </div>
  );
}
