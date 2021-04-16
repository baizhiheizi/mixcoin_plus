import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import {
  MixinNetworkSnapshot,
  useAdminUserDeprecatedOceanSnapshotsQuery,
} from 'graphqlTypes';
import React from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

export default function UserDeprecatedOceanSnapshotsComponent(props: {
  userId: string;
}) {
  const { userId } = props;
  const { loading, data } = useAdminUserDeprecatedOceanSnapshotsQuery({
    fetchPolicy: 'network-only',
    variables: { userId },
  });
  if (loading) {
    return <LoadingComponent />;
  }
  const { adminUserDeprecatedOceanSnapshots: snapshots } = data;

  const columns: Array<ColumnProps<MixinNetworkSnapshot>> = [
    { title: 'trace ID', dataIndex: 'traceId', key: 'traceId' },
    {
      dataIndex: 'snapshotId',
      key: 'snapshotId',
      title: 'snapshotId',
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      render: (_, snapshot) => `${snapshot.amount} ${snapshot.asset.symbol}`,
      title: 'amount',
    },
    {
      dataIndex: 'decryptedMemo',
      key: 'decryptedMemo',
      title: 'decryptedMemo',
    },
    {
      dataIndex: 'data',
      key: 'data',
      title: 'data',
    },
    {
      dataIndex: 'transferredAt',
      key: 'transferredAt',
      title: 'transferredAt',
    },
  ];
  return (
    <Table
      scroll={{ x: true }}
      columns={columns}
      dataSource={snapshots}
      rowKey='traceId'
      loading={loading}
      size='small'
      pagination={{ pageSize: 100 }}
    />
  );
}
