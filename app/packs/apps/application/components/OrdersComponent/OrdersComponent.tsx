import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import OrderCardComponent from 'apps/application/components/OrderCardComponent/OrderCardComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useOceanOrderConnectionQuery } from 'graphqlTypes';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Tabs } from 'zarm';

export default function OrdersComponent(props: {
  marketId?: string;
  timestamp?: number;
}) {
  const { marketId, timestamp } = props;
  const history = useHistory();
  const location = useLocation<any>();
  const { t } = useTranslation();
  const filters = ['booking', 'history'];
  const [filter, setFilter] = useState(
    location.state?.activeFilter || 'booking',
  );
  const { loading, data, refetch, fetchMore } = useOceanOrderConnectionQuery({
    variables: { marketId, filter },
  });
  useEffect(() => {
    if (!loading) {
      refetch();
    }
  }, [timestamp, marketId, filter]);

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
    <>
      <Tabs
        value={filters.findIndex((i) => i === filter)}
        onChange={(index) => {
          setFilter(filters[index]);
          history.replace({
            ...history.location,
            state: { activeFilter: filters[index] },
          });
        }}
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
            onClick={() => history.push(`/orders/${order.id}`)}
          >
            <OrderCardComponent
              order={order}
              linkToMarket={!Boolean(marketId)}
            />
          </div>
        ))}
      </PullComponent>
    </>
  );
}
