import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import {
  useDeprecatedOceanOrdersQuery,
  useGenerateCancelDeprecatedOceanOrderPayUrlMutation,
} from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Message, Modal } from 'zarm';

export default function DeprecatedOrdersPage() {
  const { t } = useTranslation();
  const { loading, data, refetch } = useDeprecatedOceanOrdersQuery();
  const [
    generateCancelPayUrl,
  ] = useGenerateCancelDeprecatedOceanOrderPayUrlMutation({
    update: (_, { data: { generateCancelDeprecatedOceanOrderPayUrl } }) => {
      location.replace(generateCancelDeprecatedOceanOrderPayUrl);
    },
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const { deprecatedOceanOrders: orders } = data;

  return (
    <div className='min-h-screen bg-white dark:bg-dark'>
      <NavbarComponent back />
      <Message className='mb-4' size='lg' theme='warning'>
        {t('deprecated_version_notice')}
      </Message>
      <PullComponent hasNextPage={false} refetch={refetch}>
        {orders.map((order) => (
          <div key={order.traceId} className='flex items-center px-4 py-1'>
            <div className='flex-1 text-gray-800 dark:text-gray-50'>
              {order.quoteAsset.symbol}/{order.baseAsset.symbol}
            </div>
            <div
              className={`flex-1 text-center ${
                order.side === 'ask' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {order.side === 'ask' ? t('sell') : t('buy')}
            </div>
            <div
              className='flex-1 text-right text-red-500'
              onClick={() =>
                Modal.confirm({
                  content: t('confirm_cancel_ocean_order'),
                  onOk: () =>
                    generateCancelPayUrl({
                      variables: { input: { traceId: order.traceId } },
                    }),
                })
              }
            >
              {t('cancel')}
            </div>
          </div>
        ))}
      </PullComponent>
    </div>
  );
}
