import { UserAsset, useAdminWalletBalanceQuery } from 'graphqlTypes';
import { Avatar, Button, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

export default function WalletBalanceComponent(props: { userId?: string }) {
  const { userId } = props;
  const { loading, data, refetch } = useAdminWalletBalanceQuery({
    fetchPolicy: 'network-only',
    variables: { userId },
  });
  if (loading) {
    return <LoadingComponent />;
  }
  const { adminWalletBalance: assets } = data;

  const columns: Array<ColumnProps<UserAsset>> = [
    { title: 'asset ID', dataIndex: 'assetId', key: 'assetId' },
    {
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      render: (text, record) => <Avatar src={text}>{record.symbol[0]}</Avatar>,
      title: 'icon',
    },
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
    {
      dataIndex: 'priceUsd',
      key: 'priceUsd',
      render: (text, record) => {
        return record.balance > 0
          ? `$ ${parseFloat(text) * record.balance}`
          : 0;
      },
      title: 'Value',
    },
  ];
  return (
    <>
      <div className='flex justify-end mb-4'>
        <Button type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={assets}
        rowKey='assetId'
        loading={loading}
        pagination={{ pageSize: 50 }}
        size='small'
      />
    </>
  );
}
