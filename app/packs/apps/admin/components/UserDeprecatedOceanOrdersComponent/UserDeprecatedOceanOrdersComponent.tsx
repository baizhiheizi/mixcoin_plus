import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import {
  OceanOrder,
  useAdminUserDeprecatedOceanOrdersQuery,
} from 'graphqlTypes';
import React from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

export default function UserDeprecatedOceanSnapshotsComponent(props: {
  userId: string;
}) {
  const { userId } = props;
  const { loading, data } = useAdminUserDeprecatedOceanOrdersQuery({
    fetchPolicy: 'network-only',
    variables: { userId },
  });
  if (loading) {
    return <LoadingComponent />;
  }
  const { adminUserDeprecatedOceanOrders: orders } = data;

  const columns: Array<ColumnProps<OceanOrder>> = [
    { title: 'trace ID', dataIndex: 'traceId', key: 'traceId' },
    {
      dataIndex: 'orderType',
      key: 'orderType',
      title: 'orderType',
    },
    {
      dataIndex: 'side',
      key: 'side',
      title: 'side',
    },
    {
      dataIndex: 'price',
      key: 'price',
      title: 'price',
    },
    {
      dataIndex: 'ticker',
      key: 'ticker',
      render: (_, order) =>
        `${order.baseAsset.symbol}/${order.quoteAsset.symbol}`,
      title: 'ticker',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
  ];
  return (
    <Table
      scroll={{ x: true }}
      columns={columns}
      dataSource={orders}
      rowKey='traceId'
      loading={loading}
      size='small'
      pagination={{ pageSize: 100 }}
    />
  );
}
