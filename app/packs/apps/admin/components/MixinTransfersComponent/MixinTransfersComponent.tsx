import { Button, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { OCEAN_ENGINE_USER_ID, useMixinBot } from 'apps/shared';
import { useAdminMixinTransferConnectionQuery } from 'graphqlTypes';
import React, { useState } from 'react';

export default function MixinTransfersComponent(props: {
  oceanOrderId?: string;
  userId?: string;
  opponentId?: string;
}) {
  const { oceanOrderId, userId, opponentId } = props;
  const [transferType, setTranferType] = useState('all');
  const {
    loading,
    data,
    refetch,
    fetchMore,
  } = useAdminMixinTransferConnectionQuery({
    variables: { oceanOrderId, userId, opponentId, transferType },
  });
  const { appId } = useMixinBot();

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminMixinTransferConnection: {
      nodes: transfers,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const columns: Array<ColumnProps<any>> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'userId',
      key: 'userId',
      title: 'userId',
    },
    {
      dataIndex: 'recipient',
      key: 'recipient',
      render: (_, transfer) => (
        <>
          {transfer.opponentId === OCEAN_ENGINE_USER_ID ? (
            'OCEAN ENGINE'
          ) : transfer.opponentId === appId ? (
            'Mixcoin'
          ) : transfer.recipient ? (
            <div>
              {transfer.recipient.name}({transfer.recipient.mixinId})
            </div>
          ) : (
            transfer.opponentId
          )}
        </>
      ),
      title: 'Recipient',
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      render: (_, transfer) => `${transfer.amount} ${transfer.asset.symbol}`,
      title: 'Amount',
    },
    {
      dataIndex: 'transferType',
      key: 'transferType',
      title: 'Transfer Type',
    },
    {
      dataIndex: 'memo',
      key: 'memo',
      render: (text) => <span className='max-w-sm line-clamp-2'>{text}</span>,
      title: 'memo',
    },
    {
      dataIndex: 'processedAt',
      key: 'processedAt',
      title: 'processedAt',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
  ];

  return (
    <>
      <div className='flex justify-between mb-4'>
        <Select
          className='w-40'
          value={transferType}
          onChange={(value) => setTranferType(value)}
        >
          <Select.Option value='all'>All</Select.Option>
          <Select.Option value='default'>Default</Select.Option>
          <Select.Option value='ocean_order_mixcoin_fee'>
            MixcoinFee
          </Select.Option>
          <Select.Option value='ocean_order_invitation_commission'>
            Invitation Commission
          </Select.Option>
          <Select.Option value='ocean_order_group_owner_commission'>
            Group Owner Commission
          </Select.Option>
          <Select.Option value='ocean_broker_balance'>
            Broker Balance
          </Select.Option>
          <Select.Option value='ocean_broker_register'>
            Broker Register
          </Select.Option>
          <Select.Option value='ocean_order_create'>Order Create</Select.Option>
          <Select.Option value='ocean_order_cancel'>Order Cancel</Select.Option>
          <Select.Option value='ocean_order_match'>Order Match</Select.Option>
          <Select.Option value='ocean_order_refund'>Order Refund</Select.Option>
        </Select>
        <Button type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={transfers}
        rowKey='id'
        pagination={false}
      />
      <div className='m-4 text-center'>
        <Button
          type='link'
          loading={loading}
          disabled={!hasNextPage}
          onClick={() => {
            fetchMore({
              variables: {
                after: endCursor,
              },
            });
          }}
        >
          {hasNextPage ? 'Load More' : 'No More'}
        </Button>
      </div>
    </>
  );
}
