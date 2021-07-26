import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import OrderCardComponent from 'apps/application/components/OrderCardComponent/OrderCardComponent';
import { useOceanOrderQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import OceanSnapshotsComponent from './components/OceanSnapshotsComponent/OceanSnapshotsComponent';

export default function OrderPage() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const { loading, data } = useOceanOrderQuery({
    variables: { id: orderId },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const { oceanOrder: order } = data;

  return (
    <div className='min-h-screen bg-white dark:bg-dark'>
      <OrderCardComponent order={order} />
      <OceanSnapshotsComponent oceanOrderId={order.id} />
    </div>
  );
}
