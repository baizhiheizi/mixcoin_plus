import { Button, Table, Popconfirm } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import {
  useAdminBookingOrderActivityParticipantConnectionQuery,
  useAdminBookingOrderActivityParticipantDistributeBonusMutation,
} from 'graphqlTypes';
import React from 'react';
import { Link } from 'react-router-dom';

export default function BookingOrderActivityParticipantsComponent(props: {
  userId?: string;
  bookingOrderActivityId?: string;
  state?: string;
}) {
  const { userId, bookingOrderActivityId, state } = props;
  const { loading, data, refetch, fetchMore } =
    useAdminBookingOrderActivityParticipantConnectionQuery({
      variables: {
        userId,
        bookingOrderActivityId,
        state,
      },
    });
  const [distributeBonus] =
    useAdminBookingOrderActivityParticipantDistributeBonusMutation({
      update: () => refetch(),
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminBookingOrderActivityParticipantConnection: {
      nodes: participants,
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
      dataIndex: 'user',
      key: 'user',
      render: (_, participant) => (
        <Link to={`/users/${participant.userId}`}>
          <div className='flex items-center'>
            <img
              className='w-6 h-6 mr-1 rounded-full'
              src={participant.user.avatar}
            />
            {participant.user.name}({participant.user.mixinId})
          </div>
        </Link>
      ),
      title: 'user',
    },
    {
      dataIndex: 'market',
      key: 'market',
      render: (_, participant) =>
        `${participant.bookingOrderActivity.market.baseAsset.symbol}/${participant.bookingOrderActivity.market.quoteAsset.symbol}`,
      title: 'Market',
    },
    {
      dataIndex: 'date',
      key: 'date',
      render: (_, participant) => (
        <>
          {participant.bookingOrderActivity.startedAt}~
          {participant.bookingOrderActivity.endedAt}
        </>
      ),
      title: 'Date',
    },
    {
      dataIndex: 'bonus',
      key: 'bonus',
      render: (_, participant) => (
        <>
          {participant.bonus.toFixed(8)} {participant.bonusAsset.symbol}
        </>
      ),
      title: 'bonus',
    },
    {
      dataIndex: 'scores',
      key: 'scores',
      render: (_, participant) => (
        <>
          {participant.scores}({(participant.scoresRatio * 100).toFixed(2)}%)
        </>
      ),
      title: 'scores',
    },
    {
      dataIndex: 'state',
      key: 'state',
      title: 'state',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, participant) => (
        <Popconfirm
          disabled={
            participant.bonus < 0.000_000_01 || participant.state !== 'pending'
          }
          title={`Are you sure to transfer ${participant.bonus.toFixed(8)} ${
            participant.bonusAsset.symbol
          } to ${participant.user.name}`}
          onConfirm={() =>
            distributeBonus({
              variables: { input: { id: participant.id } },
            })
          }
        >
          <span className='cursor-pointer'>Distribute</span>
        </Popconfirm>
      ),
      title: 'Actions',
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
        dataSource={participants}
        rowKey='id'
        pagination={false}
        size='small'
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
