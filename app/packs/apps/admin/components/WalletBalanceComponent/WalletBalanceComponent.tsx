import {
  UserAsset,
  useAdminWalletBalanceQuery,
  useAdminArbitragerWithdrawBalanceMutation,
} from 'graphqlTypes';
import { Avatar, Button, Table, Popconfirm, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

export default function WalletBalanceComponent(props: { userId?: string }) {
  const { userId } = props;
  const { loading, data, refetch } = useAdminWalletBalanceQuery({
    fetchPolicy: 'network-only',
    variables: { userId },
  });
  const [withdrawBalance, { loading: withdrawing }] =
    useAdminArbitragerWithdrawBalanceMutation({
      update: (_, { data: { adminArbitragerWithdrawBalance } }) => {
        if (adminArbitragerWithdrawBalance) {
          message.success('success');
          refetch();
        } else {
          message.error('faied');
        }
      },
    });
  if (loading) {
    return <LoadingComponent />;
  }
  const { adminWalletBalance: assets } = data;

  const totalUsd = assets.reduce((pre, cur) => {
    return pre + cur.priceUsd * cur.balance;
  }, 0);

  const columns: Array<ColumnProps<UserAsset>> = [
    { title: 'asset ID', dataIndex: 'assetId', key: 'assetId' },
    {
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      render: (text, asset) => <Avatar src={text}>{asset.symbol[0]}</Avatar>,
      title: 'icon',
    },
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
    {
      dataIndex: 'priceUsd',
      key: 'priceUsd',
      render: (text, asset) => {
        return asset.balance > 0 ? `$ ${parseFloat(text) * asset.balance}` : 0;
      },
      title: 'Value',
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, asset) => (
        <Popconfirm
          title='Are you sure to withdraw?'
          onConfirm={() =>
            withdrawBalance({
              variables: {
                input: {
                  mixinUuid: userId,
                  assetId: asset.assetId,
                },
              },
            })
          }
        >
          <Button type='link' disabled={withdrawing}>
            Withdraw
          </Button>
        </Popconfirm>
      ),
      title: 'Actions',
    },
  ];
  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <div className='text-gray-500'>Total: ${totalUsd.toFixed(4)}</div>
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
