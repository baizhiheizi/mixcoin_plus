import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import {
  useCancelOceanOrderMutation,
  useOceanOrderConnectionQuery,
} from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loading, Modal } from 'zarm';

export default function OceanOrdersComponent(props: {
  marketId?: string;
  filter: 'booking' | 'history';
}) {
  const { t } = useTranslation();
  const { marketId, filter } = props;
  const { loading, data, refetch, fetchMore } = useOceanOrderConnectionQuery({
    variables: { marketId, filter },
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
    <PullComponent
      hasNextPage={hasNextPage}
      refetch={refetch}
      fetchMore={() => fetchMore({ variables: { after: endCursor } })}
      emptyText={t('empty_orders')}
    >
      {orders.map((order: any) => (
        <div
          key={order.traceId}
          className='flex items-center px-4 py-1 space-x-2'
        >
          <div
            className={`flex-1 ${
              order.side === 'ask' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {order.side === 'ask' ? t('sell') : t('buy')}
          </div>
          <div className='flex-1'>
            {order.orderType === 'limit' ? order.price : t('market_order')}
          </div>
          <div className='flex-1 text-center'>
            {order.side === 'ask'
              ? `${order.filledAmount}/${order.amount}`
              : `${order.filledFunds}/${order.funds}`}
          </div>
          <div className='flex-1 text-right'>
            {order.state === 'booking' ? (
              <a
                className='block text-red-500'
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
                {t('cancel')}
              </a>
            ) : (
              t(`activerecord.attributes.ocean_order.state/${order.state}`)
            )}
          </div>
        </div>
      ))}
    </PullComponent>
  );
}
